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
  UserProfile,
  RouteType
} from '../types/campus';
import { 
  INITIAL_BUILDINGS, 
  INITIAL_FACILITIES, 
  INITIAL_MAINTENANCE_REPORTS, 
  INITIAL_EVENTS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockCampusData';
import { voiceNavService } from './voiceNavigationService';
import { calculateCampusRoute } from './navigationService';
import { authService } from './authService';

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
  private routeType: RouteType = 'fastest';
  private isNavPaused: boolean = false;
  private followMode: boolean = true;
  private voiceEnabled: boolean = true;
  private isRouteOverviewOpen: boolean = false;
  private isPathIssueModalOpen: boolean = false;

  // Live navigation simulation state
  private remainingDistanceMeters: number = 0;
  private navPhase: 'preview' | 'active' | 'indoor' | 'arrived' = 'preview';
  private approachingTurnFired: Set<number> = new Set();

  private currentUser: UserProfile | null = {
    id: 'user-std-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@amity.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentId: 'AMITY-CS-2026-042',
    phone: '+91 98765 43210',
    joinedDate: 'August 2024',
    hostelRoom: 'Hostel H-1 (Ramanujan), Room 304',
    emergencyContact: 'Mr. R. Sharma (+91 98765 43211)'
  };

  private isProfileModalOpen: boolean = false;
  private isAiAssistantOpen: boolean = false;
  private isCommandPaletteOpen: boolean = false;
  private isFloorPlanOpen: boolean = false;
  private isReportModalOpen: boolean = false;
  private isNavPanelOpen: boolean = false;
  private isLayersOpen: boolean = false;
  private isCrowdOpen: boolean = false;
  private isLiveNavActive: boolean = false;
  private currentNavStepIndex: number = 0;
  private isArrivalModalOpen: boolean = false;

  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedReports = localStorage.getItem('campustwin_reports');
        if (savedReports) this.reports = JSON.parse(savedReports);

        const savedBuildings = localStorage.getItem('campustwin_buildings');
        if (savedBuildings) this.buildings = JSON.parse(savedBuildings);

        const savedUser = localStorage.getItem('campustwin_user');
        if (savedUser) {
          try {
            this.currentUser = JSON.parse(savedUser);
          } catch {
            // keep fallback
          }
        }

        this.voiceEnabled = voiceNavService.getIsEnabled();
      } catch {
        // silent fail on restricted environments
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
        if (this.currentUser) {
          localStorage.setItem('campustwin_user', JSON.stringify(this.currentUser));
        } else {
          localStorage.removeItem('campustwin_user');
        }
      } catch {
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
  public getRouteType() { return this.routeType; }
  public getIsNavPaused() { return this.isNavPaused; }
  public getFollowMode() { return this.followMode; }
  public getVoiceEnabled() { return this.voiceEnabled; }
  public getIsRouteOverviewOpen() { return this.isRouteOverviewOpen; }
  public getIsPathIssueModalOpen() { return this.isPathIssueModalOpen; }
  public getRemainingDistanceMeters() { return this.remainingDistanceMeters; }
  public getNavPhase() { return this.navPhase; }
  public getCurrentUser() { return this.currentUser; }
  public getIsProfileModalOpen() { return this.isProfileModalOpen; }
  public getIsAiAssistantOpen() { return this.isAiAssistantOpen; }
  public getIsCommandPaletteOpen() { return this.isCommandPaletteOpen; }
  public getIsFloorPlanOpen() { return this.isFloorPlanOpen; }
  public getIsReportModalOpen() { return this.isReportModalOpen; }
  public getIsNavPanelOpen() { return this.isNavPanelOpen; }
  public getIsLayersOpen() { return this.isLayersOpen; }
  public getIsCrowdOpen() { return this.isCrowdOpen; }
  public getIsLiveNavActive() { return this.isLiveNavActive; }
  public getCurrentNavStepIndex() { return this.currentNavStepIndex; }
  public getIsArrivalModalOpen() { return this.isArrivalModalOpen; }

  // Actions
  public setCurrentUser(user: UserProfile | null) {
    this.currentUser = user;
    this.notify();
  }

  public updateUserProfile(updates: Partial<UserProfile>) {
    if (!this.currentUser) return;
    this.currentUser = {
      ...this.currentUser,
      ...updates
    };
    if (this.currentUser.id) {
      authService.updateProfile(this.currentUser.id, updates);
    }
    this.notify();
  }

  public setProfileModalOpen(open: boolean) {
    this.isProfileModalOpen = open;
    this.notify();
  }

  public logout() {
    this.currentUser = null;
    this.notify();
  }

  public setSelectedBuildingId(id: string | null) {
    this.selectedBuildingId = id;
    // Do NOT auto-select a room — let the user choose from the Place Card
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
    if (route) {
      this.isNavPanelOpen = true;
      if (route.routeType) this.routeType = route.routeType;
    }
    this.notify();
  }

  public setRouteType(type: RouteType) {
    this.routeType = type;
    if (this.activeRoute) {
      const updated = calculateCampusRoute(
        this.activeRoute.fromLocation,
        this.activeRoute.toLocation,
        type
      );
      if (updated) {
        this.activeRoute = updated;
      }
    }
    this.notify();
  }

  public setLiveNavActive(active: boolean) {
    this.isLiveNavActive = active;
    if (active) {
      this.currentNavStepIndex = 0;
      this.isArrivalModalOpen = false;
      this.isNavPaused = false;
      this.followMode = true;
      this.navPhase = 'active';
      this.approachingTurnFired = new Set();
      if (this.activeRoute) {
        this.remainingDistanceMeters = this.activeRoute.totalDistanceMeters;
        voiceNavService.onNavigationStart(this.activeRoute.toLocation);
      }
    } else {
      voiceNavService.cancel();
      this.isNavPaused = false;
      this.navPhase = 'preview';
    }
    this.notify();
  }

  public setNavPaused(paused: boolean) {
    this.isNavPaused = paused;
    if (paused) {
      voiceNavService.cancel();
      voiceNavService.speak('Navigation paused.');
    } else {
      voiceNavService.speak('Resuming navigation.');
      if (this.activeRoute && this.activeRoute.steps[this.currentNavStepIndex]) {
        voiceNavService.onStepChange(this.activeRoute.steps[this.currentNavStepIndex].instruction);
      }
    }
    this.notify();
  }

  public setFollowMode(mode: boolean) {
    this.followMode = mode;
    this.notify();
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    voiceNavService.setIsEnabled(enabled);
    this.notify();
  }

  public setCurrentNavStepIndex(idx: number) {
    this.currentNavStepIndex = idx;
    if (this.isLiveNavActive && this.activeRoute && !this.isNavPaused) {
      const step = this.activeRoute.steps[idx];
      if (step) {
        // Update nav phase based on step type
        if (step.turnType === 'entrance') {
          this.navPhase = 'indoor';
        } else if (step.turnType === 'arrive') {
          this.navPhase = 'arrived';
        } else if (this.navPhase !== 'indoor') {
          this.navPhase = 'active';
        }

        if (step.turnType === 'entrance' && step.indoorTransition) {
          voiceNavService.onBuildingEntrance(step.indoorTransition.buildingName);
        } else if (step.turnType === 'elevator' && step.indoorTransition) {
          voiceNavService.onFloorTransition(step.indoorTransition.floorNumber);
        } else if (step.turnType === 'arrive') {
          voiceNavService.onArrival(this.activeRoute.toLocation);
        } else {
          voiceNavService.onStepChange(step.instruction, step.distanceMeters);
        }
      }
    }
    this.notify();
  }

  public tickSimulation() {
    if (!this.isLiveNavActive || this.isNavPaused || !this.activeRoute) return;
    const steps = this.activeRoute.steps;
    const currentStep = steps[this.currentNavStepIndex];
    if (!currentStep) return;

    // Compute how many meters this step covers and decrement remaining
    const stepDist = currentStep.distanceMeters || 60;
    const decrement = Math.max(8, Math.round(stepDist / 12));
    this.remainingDistanceMeters = Math.max(0, this.remainingDistanceMeters - decrement);

    // Check if we should advance to next step
    // Each step gets ~12 ticks worth of simulation
    // We use a simple approach: track elapsed ticks per step
    const nextIdx = this.currentNavStepIndex + 1;
    if (nextIdx < steps.length && this.remainingDistanceMeters <= 0) {
      // this shouldn't happen but guard it
      this.setCurrentNavStepIndex(nextIdx);
      return;
    }

    // Fire approaching-turn voice at 40m threshold
    if (nextIdx < steps.length) {
      const nextStep = steps[nextIdx];
      if (this.remainingDistanceMeters <= 40 && !this.approachingTurnFired.has(nextIdx)) {
        this.approachingTurnFired.add(nextIdx);
        const dir = nextStep.turnType === 'left' ? 'turn left'
          : nextStep.turnType === 'right' ? 'turn right'
          : nextStep.turnType === 'entrance' ? `enter ${nextStep.indoorTransition?.buildingName || 'building'}`
          : 'continue';
        voiceNavService.onApproachingTurn(dir, Math.max(10, this.remainingDistanceMeters));
      }
    }

    this.notify();
  }

  public advanceToNextStep() {
    if (!this.activeRoute) return;
    const steps = this.activeRoute.steps;
    const nextIdx = this.currentNavStepIndex + 1;
    if (nextIdx >= steps.length) {
      this.isArrivalModalOpen = true;
      this.navPhase = 'arrived';
      voiceNavService.onArrival(this.activeRoute.toLocation);
      this.notify();
      return;
    }
    // Reset remaining for next step
    const nextStep = steps[nextIdx];
    this.remainingDistanceMeters = nextStep.distanceMeters || 60;
    this.setCurrentNavStepIndex(nextIdx);
  }

  public setArrivalModalOpen(open: boolean) {
    this.isArrivalModalOpen = open;
    if (open && this.activeRoute) {
      voiceNavService.onArrival(this.activeRoute.toLocation);
    }
    this.notify();
  }

  public setRouteOverviewOpen(open: boolean) {
    this.isRouteOverviewOpen = open;
    this.notify();
  }

  public setPathIssueModalOpen(open: boolean) {
    this.isPathIssueModalOpen = open;
    this.notify();
  }

  public reportPathIssue(issueType: string, locationName: string, notes?: string) {
    const reportId = `CT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newReport: MaintenanceReport = {
      id: reportId,
      location: locationName || 'Active Navigation Route',
      buildingId: this.selectedBuildingId || 'cs-block',
      category: 'Other',
      priority: 'high',
      description: `Path Hazard: ${issueType}${notes ? ` - ${notes}` : ''}`,
      reporterName: this.currentUser?.name || 'Anonymous Student',
      status: 'Reported',
      createdAt: now,
      updatedAt: now
    };

    this.reports.unshift(newReport);
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Hazard Reported: ${reportId}`,
      message: `Your walkway report for ${locationName} was flagged to Campus Safety.`,
      timestamp: 'Just now',
      type: 'warning',
      read: false
    });

    voiceNavService.speak('Hazard reported to campus operations.');
    this.isPathIssueModalOpen = false;
    this.notify();
  }

  public rerouteNavigation() {
    if (!this.activeRoute) return;
    voiceNavService.onReroute();

    const fromLoc = this.activeRoute.fromLocation;
    const toLoc = this.activeRoute.toLocation;
    const newRoute = calculateCampusRoute(fromLoc, toLoc, this.routeType);
    if (newRoute) {
      this.activeRoute = newRoute;
      this.currentNavStepIndex = 0;
      this.followMode = true;
    }
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

    const bldg = this.buildings.find(b => b.id === newReport.buildingId);
    if (bldg) {
      bldg.maintenanceAlertsCount += 1;
    }

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
    routeType: campusStore.getRouteType(),
    isNavPaused: campusStore.getIsNavPaused(),
    followMode: campusStore.getFollowMode(),
    voiceEnabled: campusStore.getVoiceEnabled(),
    isRouteOverviewOpen: campusStore.getIsRouteOverviewOpen(),
    isPathIssueModalOpen: campusStore.getIsPathIssueModalOpen(),
    remainingDistanceMeters: campusStore.getRemainingDistanceMeters(),
    navPhase: campusStore.getNavPhase(),
    currentUser: campusStore.getCurrentUser(),
    isProfileModalOpen: campusStore.getIsProfileModalOpen(),
    isAiAssistantOpen: campusStore.getIsAiAssistantOpen(),
    isCommandPaletteOpen: campusStore.getIsCommandPaletteOpen(),
    isFloorPlanOpen: campusStore.getIsFloorPlanOpen(),
    isReportModalOpen: campusStore.getIsReportModalOpen(),
    isNavPanelOpen: campusStore.getIsNavPanelOpen(),
    isLayersOpen: campusStore.getIsLayersOpen(),
    isCrowdOpen: campusStore.getIsCrowdOpen(),
    isLiveNavActive: campusStore.getIsLiveNavActive(),
    currentNavStepIndex: campusStore.getCurrentNavStepIndex(),
    isArrivalModalOpen: campusStore.getIsArrivalModalOpen(),

    // Dispatchers
    setCurrentUser: (user: UserProfile | null) => campusStore.setCurrentUser(user),
    updateUserProfile: (updates: Partial<UserProfile>) => campusStore.updateUserProfile(updates),
    setProfileModalOpen: (open: boolean) => campusStore.setProfileModalOpen(open),
    logout: () => campusStore.logout(),
    setSelectedBuildingId: (id: string | null) => campusStore.setSelectedBuildingId(id),
    setSelectedRoom: (room: Room | null) => campusStore.setSelectedRoom(room),
    setActiveCategoryFilter: (cat: BuildingCategory | 'all') => campusStore.setActiveCategoryFilter(cat),
    toggleSmartFilter: (key: keyof ReturnType<typeof campusStore.getSmartFilters>) => campusStore.toggleSmartFilter(key),
    setActiveRoute: (route: NavigationResult | null) => campusStore.setActiveRoute(route),
    setRouteType: (type: RouteType) => campusStore.setRouteType(type),
    setLiveNavActive: (active: boolean) => campusStore.setLiveNavActive(active),
    setNavPaused: (paused: boolean) => campusStore.setNavPaused(paused),
    setFollowMode: (mode: boolean) => campusStore.setFollowMode(mode),
    setVoiceEnabled: (enabled: boolean) => campusStore.setVoiceEnabled(enabled),
    setRouteOverviewOpen: (open: boolean) => campusStore.setRouteOverviewOpen(open),
    setPathIssueModalOpen: (open: boolean) => campusStore.setPathIssueModalOpen(open),
    reportPathIssue: (type: string, loc: string, notes?: string) => campusStore.reportPathIssue(type, loc, notes),
    rerouteNavigation: () => campusStore.rerouteNavigation(),
    setCurrentNavStepIndex: (idx: number) => campusStore.setCurrentNavStepIndex(idx),
    setArrivalModalOpen: (open: boolean) => campusStore.setArrivalModalOpen(open),
    tickSimulation: () => campusStore.tickSimulation(),
    advanceToNextStep: () => campusStore.advanceToNextStep(),
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
