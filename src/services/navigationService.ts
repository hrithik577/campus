import { GRAPH_NODES, GRAPH_EDGES, INITIAL_BUILDINGS } from '../data/mockCampusData';
import { NavigationResult, RouteNavigationStep, RouteType, TurnType, Room } from '../types/campus';

export interface MultiRouteOptions {
  fastest: NavigationResult;
  accessible: NavigationResult;
  crowd: NavigationResult;
  covered: NavigationResult;
}

export function calculateCampusRoute(
  fromId: string,
  toId: string,
  routeOption: RouteType | boolean = 'fastest'
): NavigationResult | null {
  const routeType: RouteType = typeof routeOption === 'boolean' 
    ? (routeOption ? 'accessible' : 'fastest')
    : routeOption;

  const startNode = findGraphNode(fromId);
  const endNode = findGraphNode(toId);

  const fallbackStartId = 'node-north-gate';
  const fallbackEndId = 'node-cs-block';

  const startId = startNode ? startNode.id : fallbackStartId;
  const endId = endNode ? endNode.id : fallbackEndId;

  return computeDijkstra(startId, endId, routeType, fromId, toId);
}

export function calculateAllRouteOptions(fromId: string, toId: string): MultiRouteOptions {
  const fastest = calculateCampusRoute(fromId, toId, 'fastest') || createDirectFallback(fromId, toId, 'fastest');
  const accessible = calculateCampusRoute(fromId, toId, 'accessible') || createDirectFallback(fromId, toId, 'accessible');
  const crowd = calculateCampusRoute(fromId, toId, 'crowd') || createDirectFallback(fromId, toId, 'crowd');
  const covered = calculateCampusRoute(fromId, toId, 'covered') || createDirectFallback(fromId, toId, 'covered');

  return { fastest, accessible, crowd, covered };
}

function findGraphNode(identifier: string) {
  if (!identifier) return null;
  const cleanId = identifier.toLowerCase().trim();

  // 1. Direct node match
  let match = GRAPH_NODES.find(n => n.id.toLowerCase() === cleanId);
  if (match) return match;

  // 2. Direct buildingId on node
  match = GRAPH_NODES.find(n => n.buildingId && n.buildingId.toLowerCase() === cleanId);
  if (match) return match;

  // 3. Match building code or name in INITIAL_BUILDINGS
  const bldg = INITIAL_BUILDINGS.find(
    b => b.id.toLowerCase() === cleanId || 
         b.name.toLowerCase().includes(cleanId) ||
         cleanId.includes(b.name.toLowerCase()) ||
         b.code.toLowerCase() === cleanId
  );
  if (bldg) {
    match = GRAPH_NODES.find(n => n.buildingId === bldg.id);
    if (match) return match;
  }

  // 4. Room search like "lab 204", "lab-204"
  if (cleanId.includes('lab') || cleanId.includes('204') || cleanId.includes('c-04')) {
    match = GRAPH_NODES.find(n => n.buildingId === 'cs-block');
    if (match) return match;
  }

  if (cleanId.includes('lib') || cleanId.includes('301')) {
    match = GRAPH_NODES.find(n => n.buildingId === 'central-lib');
    if (match) return match;
  }

  if (cleanId.includes('cafe') || cleanId.includes('food')) {
    match = GRAPH_NODES.find(n => n.buildingId === 'cafeteria-main');
    if (match) return match;
  }

  if (cleanId.includes('audi') || cleanId.includes('keynote')) {
    match = GRAPH_NODES.find(n => n.buildingId === 'auditorium-main');
    if (match) return match;
  }

  return null;
}

function computeDijkstra(
  startId: string,
  endId: string,
  routeType: RouteType,
  userFromText: string,
  userToText: string
): NavigationResult {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  GRAPH_NODES.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });

  distances[startId] = 0;

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach(nodeId => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentId = nodeId;
      }
    });

    if (!currentId || minDistance === Infinity) break;
    if (currentId === endId) break;

    unvisited.delete(currentId);

    const edges = GRAPH_EDGES.filter(e => e.from === currentId || e.to === currentId);

    for (const edge of edges) {
      if (routeType === 'accessible' && !edge.isAccessible) continue;

      const neighborId = edge.from === currentId ? edge.to : edge.from;
      if (!unvisited.has(neighborId)) continue;

      let edgeWeight = edge.distanceMeters;

      // Adjust weights based on route mode
      if (routeType === 'crowd') {
        // Penalize routes passing through crowded nodes like Central Plaza or Cafeteria
        if (neighborId === 'node-central-plaza' || neighborId === 'node-cafeteria') {
          edgeWeight *= 1.45;
        }
      } else if (routeType === 'covered') {
        // Covered/indoor walkways bonus: open road segments get minor penalty
        if (neighborId === 'node-north-road' || neighborId === 'node-stadium') {
          edgeWeight *= 1.35;
        }
      } else if (routeType === 'accessible') {
        // Keep smooth ramp/elevator paths favored
        edgeWeight *= 1.05;
      }

      const alt = distances[currentId] + edgeWeight;
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;
      }
    }
  }

  // Path reconstruction
  const pathNodeIds: string[] = [];
  let curr: string | null = endId;
  while (curr) {
    pathNodeIds.unshift(curr);
    curr = previous[curr];
  }

  if (pathNodeIds.length === 0 || pathNodeIds[0] !== startId) {
    pathNodeIds.length = 0;
    pathNodeIds.push(startId, endId);
  }

  const pathPoints: { x: number; y: number }[] = [];
  const steps: RouteNavigationStep[] = [];
  let totalPhysicalDist = 0;

  for (let idx = 0; idx < pathNodeIds.length; idx++) {
    const nodeId = pathNodeIds[idx];
    const nodeObj = GRAPH_NODES.find(n => n.id === nodeId)!;
    pathPoints.push({ x: nodeObj.x, y: nodeObj.y });

    let stepDist = 0;
    let turnType: TurnType = 'straight';
    let stepInst = `Proceed to ${nodeObj.name}`;

    if (idx === 0) {
      stepInst = `Start navigation from ${nodeObj.name}`;
      turnType = 'straight';
    } else {
      const prevNodeId = pathNodeIds[idx - 1];
      const prevNode = GRAPH_NODES.find(n => n.id === prevNodeId)!;
      const edge = GRAPH_EDGES.find(
        e => (e.from === prevNodeId && e.to === nodeId) || (e.from === nodeId && e.to === prevNodeId)
      );
      stepDist = edge ? edge.distanceMeters : 110;
      totalPhysicalDist += stepDist;

      // Determine turn direction from vectors
      if (idx > 1) {
        const p0 = GRAPH_NODES.find(n => n.id === pathNodeIds[idx - 2])!;
        const v1 = { x: prevNode.x - p0.x, y: prevNode.y - p0.y };
        const v2 = { x: nodeObj.x - prevNode.x, y: nodeObj.y - prevNode.y };
        const cross = v1.x * v2.y - v1.y * v2.x;

        if (cross > 500) {
          turnType = 'right';
          stepInst = `Turn right towards ${nodeObj.name}`;
        } else if (cross < -500) {
          turnType = 'left';
          stepInst = `Turn left towards ${nodeObj.name}`;
        } else {
          turnType = 'straight';
          stepInst = `Continue straight along walkway (${stepDist}m)`;
        }
      } else {
        turnType = 'straight';
        stepInst = `Walk ${stepDist}m towards ${nodeObj.name}`;
      }
    }

    steps.push({
      stepIndex: steps.length + 1,
      instruction: stepInst,
      distanceMeters: stepDist,
      nodeId: nodeObj.id,
      coords: { x: nodeObj.x, y: nodeObj.y },
      turnType,
      landmark: nodeObj.name
    });
  }

  // Check if destination includes a specific room or floor
  const targetText = (userToText || '').toLowerCase();
  const isLab204 = targetText.includes('204') || targetText.includes('ai & data');
  const targetBuilding = INITIAL_BUILDINGS.find(
    b => b.id === (GRAPH_NODES.find(n => n.id === endId)?.buildingId) ||
         targetText.includes(b.name.toLowerCase()) ||
         targetText.includes(b.code.toLowerCase())
  ) || INITIAL_BUILDINGS[0];

  if (isLab204 || targetText.includes('room') || targetText.includes('lab')) {
    // Add indoor floor-level steps for multi-story navigation
    const bldgEntranceStep: RouteNavigationStep = {
      stepIndex: steps.length + 1,
      instruction: `Enter ${targetBuilding.name} via Main Entrance`,
      distanceMeters: 20,
      nodeId: endId,
      coords: pathPoints[pathPoints.length - 1],
      turnType: 'entrance',
      indoorTransition: {
        buildingName: targetBuilding.name,
        floorNumber: 2,
        roomCode: 'Lab 204'
      }
    };

    const elevatorStep: RouteNavigationStep = {
      stepIndex: steps.length + 2,
      instruction: routeType === 'accessible' 
        ? `Take elevator to Floor 2 (Accessible Ramp access)` 
        : `Take stairs or elevator to Floor 2`,
      distanceMeters: 15,
      nodeId: endId,
      coords: pathPoints[pathPoints.length - 1],
      turnType: 'elevator',
      indoorTransition: {
        buildingName: targetBuilding.name,
        floorNumber: 2,
        roomCode: 'Lab 204'
      }
    };

    const arrivalStep: RouteNavigationStep = {
      stepIndex: steps.length + 3,
      instruction: `Turn left along corridor. Arrive at Lab 204 (AI & Data Science Lab).`,
      distanceMeters: 25,
      nodeId: endId,
      coords: pathPoints[pathPoints.length - 1],
      turnType: 'arrive',
      indoorTransition: {
        buildingName: targetBuilding.name,
        floorNumber: 2,
        roomCode: 'Lab 204'
      }
    };

    totalPhysicalDist += 60;
    steps.push(bldgEntranceStep, elevatorStep, arrivalStep);
  } else {
    // Standard building arrival
    const last = steps[steps.length - 1];
    if (last) {
      last.turnType = 'arrive';
      last.instruction = `Arrive at destination: ${userToText || targetBuilding.name}`;
    }
  }

  // Adjust distance and walking time based on route profile
  let finalDist = totalPhysicalDist;
  if (routeType === 'accessible') finalDist = Math.round(totalPhysicalDist * 1.15);
  else if (routeType === 'crowd') finalDist = Math.round(totalPhysicalDist * 1.08);
  else if (routeType === 'covered') finalDist = Math.round(totalPhysicalDist * 1.22);

  const walkingSpeedMetersPerMin = 75; // average ~4.5 km/h
  const estimatedWalkingMinutes = Math.max(1, Math.round(finalDist / walkingSpeedMetersPerMin));

  // Compute live ETA formatted timestamp
  const arrivalDate = new Date(Date.now() + estimatedWalkingMinutes * 60 * 1000);
  const hours = arrivalDate.getHours();
  const minutes = arrivalDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const etaText = `Arrive ${displayHours}:${displayMinutes} ${ampm}`;

  return {
    fromLocation: userFromText || GRAPH_NODES.find(n => n.id === startId)?.name || 'North Gate Entrance',
    toLocation: userToText || targetBuilding.name,
    totalDistanceMeters: finalDist,
    estimatedWalkingMinutes,
    isAccessibleRoute: routeType === 'accessible',
    routeType,
    etaText,
    steps,
    pathPoints
  };
}

function createDirectFallback(fromId: string, toId: string, routeType: RouteType): NavigationResult {
  const dist = routeType === 'accessible' ? 510 : routeType === 'crowd' ? 460 : routeType === 'covered' ? 540 : 420;
  const mins = Math.max(1, Math.round(dist / 75));
  const arrivalDate = new Date(Date.now() + mins * 60 * 1000);
  const hours = arrivalDate.getHours() % 12 || 12;
  const minutes = arrivalDate.getMinutes() < 10 ? `0${arrivalDate.getMinutes()}` : arrivalDate.getMinutes();
  const ampm = arrivalDate.getHours() >= 12 ? 'PM' : 'AM';

  return {
    fromLocation: 'North Gate Entrance',
    toLocation: toId || 'Lab 204 (CS Block)',
    totalDistanceMeters: dist,
    estimatedWalkingMinutes: mins,
    isAccessibleRoute: routeType === 'accessible',
    routeType,
    etaText: `Arrive ${hours}:${minutes} ${ampm}`,
    steps: [
      {
        stepIndex: 1,
        instruction: 'Start navigation from North Gate Entrance',
        distanceMeters: 120,
        nodeId: 'node-north-gate',
        coords: { x: 140, y: 170 },
        turnType: 'straight'
      },
      {
        stepIndex: 2,
        instruction: 'Continue straight along Central Walkway',
        distanceMeters: 140,
        nodeId: 'node-north-road',
        coords: { x: 300, y: 170 },
        turnType: 'straight'
      },
      {
        stepIndex: 3,
        instruction: 'Turn right towards Computer Science Block',
        distanceMeters: 90,
        nodeId: 'node-cs-block',
        coords: { x: 450, y: 270 },
        turnType: 'right'
      },
      {
        stepIndex: 4,
        instruction: 'Enter Computer Science Block via Main Foyer',
        distanceMeters: 20,
        nodeId: 'node-cs-block',
        coords: { x: 450, y: 270 },
        turnType: 'entrance',
        indoorTransition: {
          buildingName: 'Computer Science Block',
          floorNumber: 2,
          roomCode: 'Lab 204'
        }
      },
      {
        stepIndex: 5,
        instruction: routeType === 'accessible' ? 'Take elevator to Floor 2' : 'Take stairs or elevator to Floor 2',
        distanceMeters: 15,
        nodeId: 'node-cs-block',
        coords: { x: 450, y: 270 },
        turnType: 'elevator',
        indoorTransition: {
          buildingName: 'Computer Science Block',
          floorNumber: 2,
          roomCode: 'Lab 204'
        }
      },
      {
        stepIndex: 6,
        instruction: 'Arrive at Lab 204 (AI & Data Science Lab)',
        distanceMeters: 35,
        nodeId: 'node-cs-block',
        coords: { x: 450, y: 270 },
        turnType: 'arrive'
      }
    ],
    pathPoints: [
      { x: 140, y: 170 },
      { x: 300, y: 170 },
      { x: 450, y: 270 }
    ]
  };
}
