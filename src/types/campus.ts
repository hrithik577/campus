export type BuildingCategory = 
  | 'academic'
  | 'labs'
  | 'library'
  | 'food'
  | 'sports'
  | 'hostels'
  | 'parking'
  | 'medical'
  | 'admin'
  | 'innovation'
  | 'auditorium'
  | 'mess'
  | 'mart'
  | 'mrc'
  | 'gym'
  | 'basketball'
  | 'football';

export type OperationalStatus = 'operational' | 'available' | 'crowded' | 'maintenance' | 'closed';

export type CrowdLevel = 'low' | 'medium' | 'high';

export interface Room {
  id: string;
  name: string;
  code: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  status: OperationalStatus;
  type: 'lab' | 'classroom' | 'auditorium' | 'office' | 'study_room' | 'conference';
  equipment: string[];
  isAccessible: boolean;
  nextScheduledClass?: string;
}

export interface Building {
  id: string;
  code: string;
  name: string;
  category: BuildingCategory;
  description: string;
  floorsCount: number;
  totalRooms: number;
  totalLabs: number;
  totalAuditoriums: number;
  capacity: number;
  currentOccupancy: number;
  occupancyPercentage: number;
  status: OperationalStatus;
  crowdLevel: CrowdLevel;
  openingHours: string;
  accessibilityFeatures: string[];
  equipmentOperationalPct: number;
  svgPath: {
    x: number;
    y: number;
    width: number;
    height: number;
    shape?: 'rect' | 'polygon' | 'l-shape';
    polygonPoints?: string;
  };
  entranceCoords: { x: number; y: number };
  popularRooms: Room[];
  facilities: string[];
  maintenanceAlertsCount: number;
}

export interface Facility {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
  category: BuildingCategory;
  floor: number;
  status: OperationalStatus;
  crowdLevel: CrowdLevel;
  openingHours: string;
  rating: number;
  icon: string;
  description: string;
  isAccessible: boolean;
}

export interface MaintenanceReport {
  id: string; // e.g., CT-1048
  location: string;
  buildingId: string;
  roomCode?: string;
  category: 'Broken Light' | 'Water Leakage' | 'Damaged Desk' | 'Wi-Fi Problem' | 'AC Problem' | 'Cleanliness' | 'Other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  reporterName: string;
  status: 'Reported' | 'Assigned' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  assignedTechnician?: string;
  photoUrl?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  organizer: string;
  buildingId: string;
  buildingName: string;
  roomCode: string;
  date: string;
  time: string;
  category: 'academic' | 'hackathon' | 'sports' | 'cultural' | 'workshop';
  attendeesCount: number;
  description: string;
  isFeatured: boolean;
}

export interface CampusGraphNode {
  id: string;
  name: string;
  x: number;
  y: number;
  buildingId?: string;
  roomCode?: string;
  isEntrance?: boolean;
}

export interface CampusGraphEdge {
  from: string;
  to: string;
  distanceMeters: number;
  isAccessible: boolean;
}

export type RouteType = 'fastest' | 'accessible' | 'crowd' | 'covered';
export type TurnType = 'straight' | 'left' | 'right' | 'slight_left' | 'slight_right' | 'entrance' | 'elevator' | 'stairs' | 'arrive';

export interface RouteNavigationStep {
  stepIndex: number;
  instruction: string;
  distanceMeters: number;
  nodeId: string;
  coords: { x: number; y: number };
  turnType?: TurnType;
  landmark?: string;
  indoorTransition?: {
    buildingName: string;
    floorNumber: number;
    roomCode?: string;
  };
}

export interface NavigationResult {
  fromLocation: string;
  toLocation: string;
  totalDistanceMeters: number;
  estimatedWalkingMinutes: number;
  isAccessibleRoute: boolean;
  routeType?: RouteType;
  etaText?: string;
  steps: RouteNavigationStep[];
  pathPoints: { x: number; y: number }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
}

export interface AIResponse {
  id: string;
  text: string;
  highlightBuildingId?: string;
  suggestedAction?: {
    label: string;
    type: 'navigate' | 'view_building' | 'view_room' | 'report_issue';
    targetId: string;
  };
  relatedData?: any;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin' | 'guest';
  department?: string;
  studentId?: string;
  phone?: string;
  avatar?: string;
  joinedDate?: string;
  hostelRoom?: string;
  emergencyContact?: string;
}

