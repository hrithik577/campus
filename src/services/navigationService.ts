import { GRAPH_NODES, GRAPH_EDGES, INITIAL_BUILDINGS } from '../data/mockCampusData';
import { NavigationResult, RouteNavigationStep } from '../types/campus';

export function calculateCampusRoute(
  fromId: string,
  toId: string,
  isAccessibleOnly: boolean = false
): NavigationResult | null {
  // Find source node and target node
  const startNode = findGraphNode(fromId);
  const endNode = findGraphNode(toId);

  if (!startNode || !endNode) {
    // Fallback default navigation from North Gate to CS Block / Lab 204
    const defaultStart = GRAPH_NODES[0]; // North Gate Entrance
    const defaultEnd = GRAPH_NODES.find(n => n.id === 'node-cs-block') || GRAPH_NODES[4];
    return computeDijkstra(defaultStart.id, defaultEnd.id, isAccessibleOnly, fromId, toId);
  }

  return computeDijkstra(startNode.id, endNode.id, isAccessibleOnly, fromId, toId);
}

function findGraphNode(identifier: string) {
  const cleanId = identifier.toLowerCase().trim();

  // Check direct graph node id
  let match = GRAPH_NODES.find(n => n.id.toLowerCase() === cleanId);
  if (match) return match;

  // Check building id
  match = GRAPH_NODES.find(n => n.buildingId && n.buildingId.toLowerCase() === cleanId);
  if (match) return match;

  // Check building name or code match
  const bldg = INITIAL_BUILDINGS.find(
    b => b.id.toLowerCase() === cleanId || 
         b.name.toLowerCase().includes(cleanId) ||
         b.code.toLowerCase() === cleanId
  );
  if (bldg) {
    match = GRAPH_NODES.find(n => n.buildingId === bldg.id);
    if (match) return match;
  }

  // Room search like "lab 204", "lab-204"
  if (cleanId.includes('lab') || cleanId.includes('204') || cleanId.includes('room')) {
    match = GRAPH_NODES.find(n => n.buildingId === 'cs-block');
    if (match) return match;
  }

  return null;
}

function computeDijkstra(
  startId: string,
  endId: string,
  isAccessibleOnly: boolean,
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
    // Get unvisited node with smallest distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach(nodeId => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentId = nodeId;
      }
    });

    if (!currentId || minDistance === Infinity) break;
    if (currentId === endId) break; // Reached target

    unvisited.delete(currentId);

    // Find neighbors
    const edges = GRAPH_EDGES.filter(e => e.from === currentId || e.to === currentId);

    for (const edge of edges) {
      if (isAccessibleOnly && !edge.isAccessible) continue;

      const neighborId = edge.from === currentId ? edge.to : edge.from;
      if (!unvisited.has(neighborId)) continue;

      const alt = distances[currentId] + edge.distanceMeters;
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;
      }
    }
  }

  // Reconstruct path
  const pathNodeIds: string[] = [];
  let curr: string | null = endId;
  while (curr) {
    pathNodeIds.unshift(curr);
    curr = previous[curr];
  }

  if (pathNodeIds.length === 0 || pathNodeIds[0] !== startId) {
    // Path not found, return direct route fallback
    pathNodeIds.length = 0;
    pathNodeIds.push(startId, endId);
  }

  // Generate steps and pathPoints
  const pathPoints: { x: number; y: number }[] = [];
  const steps: RouteNavigationStep[] = [];
  let totalDist = 0;

  pathNodeIds.forEach((nodeId, idx) => {
    const nodeObj = GRAPH_NODES.find(n => n.id === nodeId)!;
    pathPoints.push({ x: nodeObj.x, y: nodeObj.y });

    let stepDist = 0;
    let stepInst = `Proceed to ${nodeObj.name}`;

    if (idx === 0) {
      stepInst = `Start navigation from ${nodeObj.name}`;
    } else {
      const prevNodeId = pathNodeIds[idx - 1];
      const edge = GRAPH_EDGES.find(
        e => (e.from === prevNodeId && e.to === nodeId) || (e.from === nodeId && e.to === prevNodeId)
      );
      stepDist = edge ? edge.distanceMeters : 100;
      totalDist += stepDist;
      stepInst = `Walk ${stepDist}m towards ${nodeObj.name}`;
    }

    if (idx === pathNodeIds.length - 1) {
      stepInst = `Arrive at destination: ${userToText || nodeObj.name}`;
    }

    steps.push({
      stepIndex: idx + 1,
      instruction: stepInst,
      distanceMeters: stepDist,
      nodeId: nodeObj.id,
      coords: { x: nodeObj.x, y: nodeObj.y }
    });
  });

  const walkingSpeedMetersPerMin = 75; // average walking pace ~4.5 km/h
  const estimatedWalkingMinutes = Math.max(1, Math.round(totalDist / walkingSpeedMetersPerMin));

  return {
    fromLocation: userFromText || GRAPH_NODES.find(n => n.id === startId)?.name || 'Current Location',
    toLocation: userToText || GRAPH_NODES.find(n => n.id === endId)?.name || 'Destination',
    totalDistanceMeters: totalDist,
    estimatedWalkingMinutes,
    isAccessibleRoute: isAccessibleOnly,
    steps,
    pathPoints
  };
}
