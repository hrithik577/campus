import { useState, useEffect } from 'react';
import { 
  Building, 
  Facility, 
  MaintenanceReport, 
  CampusEvent, 
  NotificationItem, 
  BuildingCategory, 
  NavigationResult,
  Room,
  UserProfile
} from '../types/campus';
import { 
  INITIAL_BUILDINGS, 
  INITIAL_FACILITIES, 
  INITIAL_MAINTENANCE_REPORTS, 
  INITIAL_EVENTS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockCampusData';

// Shared state container for single-page app reactivity
class CampusStore {
  private buildings: Building[] = [...INITIAL_BUILDINGS];
  private facilities: Facility[] = [...INITIAL_FACILITIES];
  private reports: MaintenanceReport[] = [...INITIAL_MAINTENANCE_REPORTS];
  private events: CampusEvent[] = [...INITIAL_EVENTS];
  private notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

  private selectedBuildingId: string | null = 'cs-block';
  private selectedRoom: Room | null = INITIAL_BUILDINGS[0].popularRooms[0];
  private activeCategoryFilter: BuildingCategory | 'all' = 'all';
  private smartFilters = {
    availableNow: false,
    lowCrowd: false,
    accessible: false,
    openNow: false,
    maintenance: false,
  };

  private activeRoute: NavigationResult | null = null;
  private currentUser: UserProfile | null = {
    id: 'user-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@amity.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentId: 'AMITY-CS-2026-042'
  };
  private isAiAssistantOpen: boolean = false;
  private isCommandPaletteOpen: boolean = false;
  private isFloorPlanOpen: boolean = false;
  private isReportModalOpen: boolean = false;
  private isNavPanelOpen: boolean = false;
  private isLayersOpen: boolean = false;
  private isCrowdOpen: boolean = false;

  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const savedReports = localStorage.getItem('campustwin_reports');
        if (savedReports) this.reports = JSON.parse(savedReports);

        const savedBuildings = localStorage.getItem('campustwin_buildings');
        if (savedBuildings) this.buildings = JSON.parse(savedBuildings);
      } catch (e) {
        console.error('Failed to load stored campus state', e);
      }
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('campustwin_reports', JSON.stringify(this.reports));
        localStorage.setItem('campustwin_buildings', JSON.stringify(this.buildings));
      } catch (e) {
        // ignore
      }
    }
  }

  // Getters
  public getBuildings() { return this.buildings; }
  public getFacilities() { return this.facilities; }
  public getReports() { return this.reports; }
  public getEvents() { return this.events; }
  public getNotifications() { return this.notifications; }
  public getSelectedBuildingId() { return this.selectedBuildingId; }
  public getSelectedRoom() { return this.selectedRoom; }
  public getActiveCategoryFilter() { return this.activeCategoryFilter; }
  public getSmartFilters() { return this.smartFilters; }
  public getActiveRoute() { return this.activeRoute; }
  public getCurrentUser() { return this.currentUser; }
  public getIsAiAssistantOpen() { return this.isAiAssistantOpen; }
  public getIsCommandPaletteOpen() { return this.isCommandPaletteOpen; }
  public getIsFloorPlanOpen() { return this.isFloorPlanOpen; }
  public getIsReportModalOpen() { return this.isReportModalOpen; }
  public getIsNavPanelOpen() { return this.isNavPanelOpen; }
  public getIsLayersOpen() { return this.isLayersOpen; }
  public getIsCrowdOpen() { return this.isCrowdOpen; }

  // Actions
  public setCurrentUser(user: UserProfile | null) {
    this.currentUser = user;
    this.notify();
  }

  public logout() {
    this.currentUser = null;
    this.notify();
  }

  public setSelectedBuildingId(id: string | null) {
    this.selectedBuildingId = id;
    if (id) {
      const b = this.buildings.find(item => item.id === id);
      if (b && b.popularRooms.length > 0) {
        this.selectedRoom = b.popularRooms[0];
      }
    }
    this.notify();
  }

  public setSelectedRoom(room: Room | null) {
    this.selectedRoom = room;
    if (room) {
      this.selectedBuildingId = room.buildingId;
    }
    this.notify();
  }

  public setActiveCategoryFilter(cat: BuildingCategory | 'all') {
    this.activeCategoryFilter = cat;
    this.notify();
  }

  public toggleSmartFilter(filterKey: keyof typeof this.smartFilters) {
    this.smartFilters[filterKey] = !this.smartFilters[filterKey];
    this.notify();
  }

  public setActiveRoute(route: NavigationResult | null) {
    this.activeRoute = route;
    if (route) this.isNavPanelOpen = true;
    this.notify();
  }

  public setAiAssistantOpen(open: boolean) {
    this.isAiAssistantOpen = open;
    this.notify();
  }

  public setCommandPaletteOpen(open: boolean) {
    this.isCommandPaletteOpen = open;
    this.notify();
  }

  public setFloorPlanOpen(open: boolean) {
    this.isFloorPlanOpen = open;
    this.notify();
  }

  public setReportModalOpen(open: boolean) {
    this.isReportModalOpen = open;
    this.notify();
  }

  public setNavPanelOpen(open: boolean) {
    this.isNavPanelOpen = open;
    this.notify();
  }

  public setLayersOpen(open: boolean) {
    this.isLayersOpen = open;
    this.notify();
  }

  public setCrowdOpen(open: boolean) {
    this.isCrowdOpen = open;
    this.notify();
  }

  // Admin and Student Mutation Actions
  public addReport(newReport: Omit<MaintenanceReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>): MaintenanceReport {
    const reportId = `CT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const report: MaintenanceReport = {
      ...newReport,
      id: reportId,
      status: 'Reported',
      createdAt: now,
      updatedAt: now
    };

    this.reports.unshift(report);

    // Increment maintenance count on target building
    const bldg = this.buildings.find(b => b.id === newReport.buildingId);
    if (bldg) {
      bldg.maintenanceAlertsCount += 1;
    }

    // Add notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Issue ${reportId} Submitted`,
      message: `Your report for ${newReport.location} has been received.`,
      timestamp: 'Just now',
      type: 'info',
      read: false
    });

    this.notify();
    return report;
  }

  public updateReportStatus(reportId: string, status: MaintenanceReport['status'], technician?: string) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      report.status = status;
      report.updatedAt = new Date().toISOString();
      if (technician) report.assignedTechnician = technician;

      // If resolved, reduce maintenance alert count on building
      if (status === 'Resolved') {
        const bldg = this.buildings.find(b => b.id === report.buildingId);
        if (bldg && bldg.maintenanceAlertsCount > 0) {
          bldg.maintenanceAlertsCount -= 1;
        }
      }

      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: `Report ${reportId} Updated`,
        message: `Status changed to '${status}' by Campus Operations.`,
        timestamp: 'Just now',
        type: status === 'Resolved' ? 'success' : 'info',
        read: false
      });

      this.notify();
    }
  }

  public updateBuildingStatus(buildingId: string, status: Building['status'], occupancyPct?: number, crowdLevel?: Building['crowdLevel']) {
    const bldg = this.buildings.find(b => b.id === buildingId);
    if (bldg) {
      bldg.status = status;
      if (occupancyPct !== undefined) {
        bldg.occupancyPercentage = occupancyPct;
        bldg.currentOccupancy = Math.round((bldg.capacity * occupancyPct) / 100);
      }
      if (crowdLevel) {
        bldg.crowdLevel = crowdLevel;
      }
      this.notify();
    }
  }

  public markNotificationAsRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.notify();
    }
  }
}

export const campusStore = new CampusStore();

// React hook for binding store state to components
export function useCampusStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = campusStore.subscribe(() => {
      setTick(t => t + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    buildings: campusStore.getBuildings(),
    facilities: campusStore.getFacilities(),
    reports: campusStore.getReports(),
    events: campusStore.getEvents(),
    notifications: campusStore.getNotifications(),
    selectedBuildingId: campusStore.getSelectedBuildingId(),
    selectedRoom: campusStore.getSelectedRoom(),
    activeCategoryFilter: campusStore.getActiveCategoryFilter(),
    smartFilters: campusStore.getSmartFilters(),
    activeRoute: campusStore.getActiveRoute(),
    currentUser: campusStore.getCurrentUser(),
    isAiAssistantOpen: campusStore.getIsAiAssistantOpen(),
    isCommandPaletteOpen: campusStore.getIsCommandPaletteOpen(),
    isFloorPlanOpen: campusStore.getIsFloorPlanOpen(),
    isReportModalOpen: campusStore.getIsReportModalOpen(),
    isNavPanelOpen: campusStore.getIsNavPanelOpen(),
    isLayersOpen: campusStore.getIsLayersOpen(),
    isCrowdOpen: campusStore.getIsCrowdOpen(),

    // Dispatchers
    setCurrentUser: (user: UserProfile | null) => campusStore.setCurrentUser(user),
    logout: () => campusStore.logout(),
    setSelectedBuildingId: (id: string | null) => campusStore.setSelectedBuildingId(id),
    setSelectedRoom: (room: Room | null) => campusStore.setSelectedRoom(room),
    setActiveCategoryFilter: (cat: BuildingCategory | 'all') => campusStore.setActiveCategoryFilter(cat),
    toggleSmartFilter: (key: keyof ReturnType<typeof campusStore.getSmartFilters>) => campusStore.toggleSmartFilter(key),
    setActiveRoute: (route: NavigationResult | null) => campusStore.setActiveRoute(route),
    setAiAssistantOpen: (open: boolean) => campusStore.setAiAssistantOpen(open),
    setCommandPaletteOpen: (open: boolean) => campusStore.setCommandPaletteOpen(open),
    setFloorPlanOpen: (open: boolean) => campusStore.setFloorPlanOpen(open),
    setReportModalOpen: (open: boolean) => campusStore.setReportModalOpen(open),
    setNavPanelOpen: (open: boolean) => campusStore.setNavPanelOpen(open),
    setLayersOpen: (open: boolean) => campusStore.setLayersOpen(open),
    setCrowdOpen: (open: boolean) => campusStore.setCrowdOpen(open),
    addReport: (rep: Omit<MaintenanceReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => campusStore.addReport(rep),
    updateReportStatus: (id: string, st: MaintenanceReport['status'], tech?: string) => campusStore.updateReportStatus(id, st, tech),
    updateBuildingStatus: (id: string, st: Building['status'], occ?: number, crd?: Building['crowdLevel']) => campusStore.updateBuildingStatus(id, st, occ, crd),
    markNotificationAsRead: (id: string) => campusStore.markNotificationAsRead(id)
  };
}
