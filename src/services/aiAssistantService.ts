import { INITIAL_BUILDINGS, INITIAL_FACILITIES } from '../data/mockCampusData';
import { calculateCampusRoute } from './navigationService';
import { AIResponse } from '../types/campus';

export function processAIQuery(query: string): AIResponse {
  const q = query.toLowerCase().trim();
  const id = `ai-msg-${Date.now()}`;

  // Case 1: Nearest computer lab / Lab 204 query
  if (q.includes('computer lab') || q.includes('nearest lab') || q.includes('lab 204') || q.includes('where is lab 204')) {
    const csBlock = INITIAL_BUILDINGS.find(b => b.id === 'cs-block')!;
    const route = calculateCampusRoute('node-north-gate', 'cs-block');

    return {
      id,
      text: `The nearest computer lab is **Lab 204 (AI & Data Science Lab)** on the 2nd Floor of the **Computer Science Block (Building C-04)**.\n\n📍 **${route?.totalDistanceMeters || 420} m** away\n🚶 About **${route?.estimatedWalkingMinutes || 6} min** walk\n🟢 Currently **Available** (18/40 occupied)\n💻 Equipped with NVIDIA RTX 4090 Workstations & Fiber Wi-Fi.`,
      highlightBuildingId: 'cs-block',
      suggestedAction: {
        label: 'Start Navigation to Lab 204',
        type: 'navigate',
        targetId: 'cs-block'
      }
    };
  }

  // Case 2: Lab 204 availability
  if (q.includes('is lab 204 available') || q.includes('lab 204 status')) {
    return {
      id,
      text: `**Lab 204 (CS Block - 2nd Floor)** is currently **AVAILABLE**.\n\n• Current Occupancy: **18 / 40 seats** (45% capacity)\n• Next scheduled class: **11:30 AM - Deep Learning Seminar**\n• Status: Operational & unlocked for student project work.`,
      highlightBuildingId: 'cs-block',
      suggestedAction: {
        label: 'View CS Block Floor Plan',
        type: 'view_room',
        targetId: 'cs-block'
      }
    };
  }

  // Case 3: Cafeteria / Food query / least crowded cafeteria
  if (q.includes('cafeteria') || q.includes('food') || q.includes('eat') || q.includes('least crowded')) {
    const mainCafe = INITIAL_BUILDINGS.find(b => b.id === 'cafeteria-main')!;
    const northCafe = INITIAL_BUILDINGS.find(b => b.id === 'cafeteria-north')!;

    return {
      id,
      text: `Comparing campus dining options:\n\n1. **North Campus Cafe** 🟢 **Recommended**\n   • Crowd: **LOW** (${northCafe.occupancyPercentage}% occupied)\n   • Wait time: < 3 mins\n   • Best for: Gourmet coffee, wraps, quick bites\n\n2. **Central Cafeteria** 🔴 **CROWDED**\n   • Crowd: **HIGH** (${mainCafe.occupancyPercentage}% occupied)\n   • Wait time: 12-15 mins\n   • Best for: Full thali meals & live food counters`,
      highlightBuildingId: 'cafeteria-north',
      suggestedAction: {
        label: 'Navigate to North Campus Cafe',
        type: 'navigate',
        targetId: 'cafeteria-north'
      }
    };
  }

  // Case 4: Library query
  if (q.includes('library') || q.includes('quiet place') || q.includes('study')) {
    const lib = INITIAL_BUILDINGS.find(b => b.id === 'central-lib')!;
    return {
      id,
      text: `**Central Library (Building L-01)** is open today until **12:00 AM Midnight**.\n\n• Current Occupancy: **${lib.occupancyPercentage}%** (Moderate crowd)\n• Best silent spot: **Lib 301 (Silent Reading Hall - Floor 3)** with individual power pods.\n• Facilities: Group study pods, high-speed Wi-Fi, book scanners.`,
      highlightBuildingId: 'central-lib',
      suggestedAction: {
        label: 'Navigate to Central Library',
        type: 'navigate',
        targetId: 'central-lib'
      }
    };
  }

  // Case 5: Parking query
  if (q.includes('park') || q.includes('parking') || q.includes('ev charger')) {
    return {
      id,
      text: `Campus Parking Availability:\n\n1. **North Gate Parking (P-01)**: **80% full** (70 slots open). Features 8x 60kW DC EV Chargers.\n2. **South Gate Visitor Parking (P-02)**: **47% full** (105 slots open). Recommended for visitors near Auditorium & Library.`,
      highlightBuildingId: 'parking-north',
      suggestedAction: {
        label: 'Show Parking Areas',
        type: 'view_building',
        targetId: 'parking-north'
      }
    };
  }

  // Case 6: Sports query
  if (q.includes('sport') || q.includes('gym') || q.includes('badminton') || q.includes('football')) {
    return {
      id,
      text: `Sports Facilities Status:\n\n• **Sports Complex & Gym (S-01)**: 🟢 Available (31% capacity). Badminton courts 2 & 3 open.\n• **National Football Stadium**: Open for evening practice (06:00 AM - 09:00 PM).\n• **Basketball Courts**: Outdoor lights operational until 10:00 PM.`,
      highlightBuildingId: 'sports-complex',
      suggestedAction: {
        label: 'View Sports Complex',
        type: 'view_building',
        targetId: 'sports-complex'
      }
    };
  }

  // Case 7: Auditorium query
  if (q.includes('auditorium') || q.includes('keynote') || q.includes('convocation') || q.includes('seminar hall')) {
    return {
      id,
      text: `**Grand University Auditorium (Building AUD-01)** is open today.\n\n• Capacity: **1,200 Seats** (28% current occupancy)\n• Main Venue: **Grand Keynote Hall 01 (Dolby Atmos & 4K Laser Projection)**\n• Next Scheduled Event: **04:00 PM - Annual Tech Summit & Keynote**\n• Features: Wheelchair Ramps, VIP Lounge, Hearing Loop System.`,
      highlightBuildingId: 'auditorium-main',
      suggestedAction: {
        label: 'Navigate to Grand Auditorium',
        type: 'navigate',
        targetId: 'auditorium-main'
      }
    };
  }

  // Case 7: Maintenance / Wi-Fi reporting
  if (q.includes('wifi') || q.includes('report') || q.includes('broken') || q.includes('issue')) {
    return {
      id,
      text: `I can help you log a maintenance issue directly to Campus Operations. You can report broken lights, Wi-Fi outages, AC issues, or water leakage.`,
      suggestedAction: {
        label: 'Open Maintenance Reporting',
        type: 'report_issue',
        targetId: 'new-report'
      }
    };
  }

  // Generic Search Matcher
  const matchedBuilding = INITIAL_BUILDINGS.find(b => 
    b.name.toLowerCase().includes(q) || 
    b.description.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q)
  );

  if (matchedBuilding) {
    return {
      id,
      text: `I found **${matchedBuilding.name} (${matchedBuilding.code})**.\n\n• Category: **${matchedBuilding.category.toUpperCase()}**\n• Opening Hours: **${matchedBuilding.openingHours}**\n• Occupancy: **${matchedBuilding.occupancyPercentage}%** (${matchedBuilding.currentOccupancy}/${matchedBuilding.capacity})\n• Key Facilities: ${matchedBuilding.facilities.slice(0, 3).join(', ')}.`,
      highlightBuildingId: matchedBuilding.id,
      suggestedAction: {
        label: `Navigate to ${matchedBuilding.name}`,
        type: 'navigate',
        targetId: matchedBuilding.id
      }
    };
  }

  // Default Fallback
  return {
    id,
    text: `I can assist you with building locations, room availability, cafeteria crowds, navigation paths, and campus maintenance. Try asking:\n\n- *"Where is the nearest computer lab?"*\n- *"Which cafeteria is least crowded?"*\n- *"Is Lab 204 available?"*\n- *"Where can I park?"*`,
    suggestedAction: {
      label: 'Explore Campus Map',
      type: 'view_building',
      targetId: 'cs-block'
    }
  };
}
