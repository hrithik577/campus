import { INITIAL_BUILDINGS, INITIAL_FACILITIES } from '../data/mockCampusData';
import { calculateCampusRoute } from './navigationService';
import { AIResponse } from '../types/campus';

export function processAIQuery(query: string): AIResponse {
  const q = query.toLowerCase().trim();
  const id = `ai-msg-${Date.now()}`;

  // 1. Hostel Inquiries
  if (q.includes('hostel') || q.includes('hostell') || q.includes('room') || q.includes('residence') || q.includes('warden')) {
    const isHostelB = q.includes('girl') || q.includes('women') || q.includes('chawla') || q.includes('hostel b');
    const bldgId = isHostelB ? 'hostel-b' : 'hostel-a';
    const targetBldg = INITIAL_BUILDINGS.find(b => b.id === bldgId) || INITIAL_BUILDINGS.find(b => b.category === 'hostels');
    const route = calculateCampusRoute('node-north-gate', bldgId);

    return {
      id,
      text: `Greetings. Campus Twin spatial telemetry for **University Student Residences**:\n\n• **Ramanujan Student Residence (Hostel A - Men)**: 300 rooms, study lounges, laundry facilities, and 24/7 security concierge.\n• **Kalpana Chawla Residence (Hostel B - Women)**: 300 rooms with secure courtyard garden, mini gym, and residential advisor desk.\n\n📍 Walking Distance: **${route?.totalDistanceMeters || 510} m** (~${route?.estimatedWalkingMinutes || 7} min walk)\n🕒 Access Hours: **24/7 Biometric Gate Access** (Quiet study hours from 10:00 PM).\n🛡️ Resident Support: Warden Office on Ground Floor.`,
      highlightBuildingId: bldgId,
      suggestedAction: {
        label: `Navigate to ${targetBldg?.name || 'Student Hostel'}`,
        type: 'navigate',
        targetId: bldgId
      }
    };
  }

  // 2. Mess & Dining Hall Inquiries
  if (q.includes('mess') || q.includes('dining hall') || q.includes('lunch') || q.includes('dinner') || q.includes('breakfast')) {
    const mess = INITIAL_BUILDINGS.find(b => b.id === 'hostel-mess');
    const route = calculateCampusRoute('node-north-gate', 'hostel-mess');

    return {
      id,
      text: `**Central Hostel Mess & Dining (MESS-01)** Operational Status:\n\n• **Current Occupancy**: **${mess?.occupancyPercentage || 52}%** (${mess?.currentOccupancy || 340}/${mess?.capacity || 650} capacity - Moderate Flow)\n• **Meal Schedule**:\n  - Breakfast: 07:30 AM – 09:30 AM\n  - Lunch: 12:30 PM – 02:30 PM\n  - High Tea & Snacks: 05:00 PM – 06:15 PM\n  - Dinner: 07:30 PM – 10:00 PM\n• **Dietary Standards**: Nutrient-balanced vegetarian & non-vegetarian sections, salad bar, UV-purified hydration, and dietician desk.\n📍 Located **${route?.totalDistanceMeters || 580} m** from North Gate.`,
      highlightBuildingId: 'hostel-mess',
      suggestedAction: {
        label: 'Navigate to Central Mess',
        type: 'navigate',
        targetId: 'hostel-mess'
      }
    };
  }

  // 3. Student Mart & Stationery Inquiries
  if (q.includes('mart') || q.includes('stationery') || q.includes('print') || q.includes('xerox') || q.includes('shop') || q.includes('supplies')) {
    const mart = INITIAL_BUILDINGS.find(b => b.id === 'student-mart');
    const route = calculateCampusRoute('node-north-gate', 'student-mart');

    return {
      id,
      text: `**Amity Student Mart & Stationery (MART-01)** is open:\n\n• **Operating Hours**: 08:00 AM – 11:00 PM (Monday – Sunday)\n• **Current Footfall**: **${mart?.occupancyPercentage || 35}%** (Low wait times)\n• **Services Provided**:\n  - Academic textbooks, drafting tools, and approved lab coats\n  - High-speed color Xerox, project spiral binding, & large-format plotting\n  - Packaged snacks, cold beverages, toiletries, & electronic essentials\n  - Instant contactless UPI / Student Smart Card checkout.`,
      highlightBuildingId: 'student-mart',
      suggestedAction: {
        label: 'Navigate to Student Mart',
        type: 'navigate',
        targetId: 'student-mart'
      }
    };
  }

  // 4. College MRC (Medical Resource Center) Inquiries
  if (q.includes('mrc') || q.includes('medical') || q.includes('doctor') || q.includes('clinic') || q.includes('health') || q.includes('ambulance') || q.includes('medicine')) {
    const mrc = INITIAL_BUILDINGS.find(b => b.id === 'medical-center');
    const route = calculateCampusRoute('node-north-gate', 'medical-center');

    return {
      id,
      text: `**College MRC (Medical Resource Center - MRC-01)** Emergency & Health Brief:\n\n• **Status**: 🟢 **24/7 Emergency Care Active**\n• **Current Occupancy**: **${mrc?.occupancyPercentage || 18}%** (${mrc?.currentOccupancy || 18}/${mrc?.capacity || 100})\n• **Medical Facilities**:\n  - 24/7 Registered Medical Officer on duty with emergency triage\n  - 10 Observation beds with oxygen concentrators and vital monitors\n  - Fully stocked campus pharmacy dispensing prescription medicine\n  - Standby University ICU Ambulance on emergency bay\n📞 **Emergency Hotline**: Extension 108 / Mobile: +91 99990 12345\n📍 Located **${route?.totalDistanceMeters || 390} m** away near Student Center.`,
      highlightBuildingId: 'medical-center',
      suggestedAction: {
        label: 'Navigate to College MRC',
        type: 'navigate',
        targetId: 'medical-center'
      }
    };
  }

  // 5. Gym & Fitness Center Inquiries
  if (q.includes('gym') || q.includes('fitness') || q.includes('workout') || q.includes('weights') || q.includes('trainer') || q.includes('cardio')) {
    const gym = INITIAL_BUILDINGS.find(b => b.id === 'sports-complex');
    const route = calculateCampusRoute('node-north-gate', 'sports-complex');

    return {
      id,
      text: `**Amity Fitness Center & Gym (GYM-01)** Telemetry:\n\n• **Operational Hours**: 06:00 AM – 10:00 PM (Daily)\n• **Current Capacity**: **${gym?.occupancyPercentage || 31}%** (🟢 Low Crowd - Optimal for training)\n• **Amenities & Zones**:\n  - Olympic barbell stations, power racks, & dumbbell sets up to 50 kg\n  - 1st Floor Cardio Mezzanine: LifeFitness treadmills & rowing ergometers\n  - Certified physical training instructors and sports nutrition consultation\n  - Male/Female locker rooms with sauna and shower suites.`,
      highlightBuildingId: 'sports-complex',
      suggestedAction: {
        label: 'Navigate to Amity Gym',
        type: 'navigate',
        targetId: 'sports-complex'
      }
    };
  }

  // 6. Basketball Court Inquiries
  if (q.includes('basket') || q.includes('basketball') || q.includes('hoop')) {
    const bb = INITIAL_BUILDINGS.find(b => b.id === 'basketball-court');
    const route = calculateCampusRoute('node-north-gate', 'basketball-court');

    return {
      id,
      text: `**Amity Basketball Courts (BB-01)** Status:\n\n• **Facility**: Dual FIBA-grade acrylic hardcourts with pro-cushion bounce\n• **Current Occupancy**: **${bb?.occupancyPercentage || 22}%** (Courts available for practice)\n• **Lighting**: High-intensity tournament LED floodlights active until 10:00 PM\n• **Amenities**: Electronic digital scoreboard, perimeter bleachers, and hydration stations.\n📍 Just **${route?.totalDistanceMeters || 210} m** from North Gate.`,
      highlightBuildingId: 'basketball-court',
      suggestedAction: {
        label: 'Navigate to Basketball Courts',
        type: 'navigate',
        targetId: 'basketball-court'
      }
    };
  }

  // 7. Football Ground / Stadium Inquiries
  if (q.includes('foot') || q.includes('football') || q.includes('soccer') || q.includes('ground') || q.includes('stadium') || q.includes('turf') || q.includes('running track')) {
    const fb = INITIAL_BUILDINGS.find(b => b.id === 'football-ground');
    const route = calculateCampusRoute('node-north-gate', 'football-ground');

    return {
      id,
      text: `**Amity Football Ground & Athletic Turf (FB-01)** Brief:\n\n• **Pitch Specification**: Full-size FIFA-regulation artificial synthetic turf with all-weather drainage\n• **Atmosphere**: 2,500 spectator tiered seating with covered VIP stand\n• **Athletic Track**: 8-lane 400-meter international polyurethane running track\n• **Practice Schedule**: Open for open training 06:00 AM – 09:00 PM\n• **Status**: 🟢 Open and lit with stadium floodlights.`,
      highlightBuildingId: 'football-ground',
      suggestedAction: {
        label: 'Navigate to Football Ground',
        type: 'navigate',
        targetId: 'football-ground'
      }
    };
  }

  // 8. Computer Labs / Lab 204
  if (q.includes('computer lab') || q.includes('nearest lab') || q.includes('lab 204') || q.includes('where is lab 204') || q.includes('lab')) {
    const csBlock = INITIAL_BUILDINGS.find(b => b.id === 'cs-block');
    const route = calculateCampusRoute('node-north-gate', 'cs-block');

    return {
      id,
      text: `The premier campus computing facility is **Lab 204 (AI & Advanced Data Science Lab)**, situated on Floor 2 of the **Computer Science Block (Building C-04)**.\n\n📍 Spatial Proximity: **${route?.totalDistanceMeters || 420} m** (~${route?.estimatedWalkingMinutes || 6} min walk)\n🟢 Availability: **18 of 40 workstations occupied** (45% capacity)\n💻 Hardware: Dual Xeon processors, NVIDIA RTX 4090 GPU accelerators, & Gigabit fiber networking.`,
      highlightBuildingId: 'cs-block',
      suggestedAction: {
        label: 'Navigate to Lab 204',
        type: 'navigate',
        targetId: 'cs-block'
      }
    };
  }

  // 9. Central Library Inquiries
  if (q.includes('library') || q.includes('quiet') || q.includes('study') || q.includes('books')) {
    const lib = INITIAL_BUILDINGS.find(b => b.id === 'central-lib');
    const route = calculateCampusRoute('node-north-gate', 'central-lib');

    return {
      id,
      text: `**Central University Library (Building L-01)** Executive Summary:\n\n• **Opening Hours**: Open today until **12:00 AM (Midnight)**\n• **Live Occupancy**: **${lib?.occupancyPercentage || 54}%** (Moderate study activity)\n• **Recommended Quiet Spot**: **Lib 301 (Silent Reading Sanctuary - Floor 3)** with individual ergonomic power cubicles\n• **Equipped With**: Digital OPAC search terminals, thesis archives, group seminar pods, and high-speed campus Wi-Fi.`,
      highlightBuildingId: 'central-lib',
      suggestedAction: {
        label: 'Navigate to Central Library',
        type: 'navigate',
        targetId: 'central-lib'
      }
    };
  }

  // 10. Cafeteria / Food / Quick Bites
  if (q.includes('cafeteria') || q.includes('food') || q.includes('cafe') || q.includes('coffee') || q.includes('eat') || q.includes('least crowded')) {
    const northCafe = INITIAL_BUILDINGS.find(b => b.id === 'cafeteria-north');
    const mainCafe = INITIAL_BUILDINGS.find(b => b.id === 'cafeteria-main');

    return {
      id,
      text: `Comparative Dining Analytics:\n\n1. **North Campus Cafe (Building F-02)** 🟢 **Optimal Pick**\n   • Footfall: **LOW** (${northCafe?.occupancyPercentage || 35}% occupied)\n   • Queue Time: < 3 minutes\n   • Specialties: Artisan espresso, paninis, and grab-and-go salads\n\n2. **Central Cafeteria (Building F-01)** 🔴 **High Traffic**\n   • Footfall: **HIGH** (${mainCafe?.occupancyPercentage || 87}% occupied)\n   • Queue Time: 12–15 minutes\n   • Specialties: Multi-cuisine hot thalis and live grill station.`,
      highlightBuildingId: 'cafeteria-north',
      suggestedAction: {
        label: 'Navigate to North Cafe',
        type: 'navigate',
        targetId: 'cafeteria-north'
      }
    };
  }

  // 11. Parking & EV Charging
  if (q.includes('park') || q.includes('parking') || q.includes('ev charger') || q.includes('vehicle')) {
    return {
      id,
      text: `Campus Smart Parking System Status:\n\n1. **North Gate Facility (P-01)**: **80% utilized** (70 open bays available). Includes 8x 60kW DC Fast EV Charging points.\n2. **South Gate Visitor Parking (P-02)**: **47% utilized** (105 open bays available). Prime parking for Grand Auditorium and University Library.`,
      highlightBuildingId: 'parking-north',
      suggestedAction: {
        label: 'Show Parking Locations',
        type: 'view_building',
        targetId: 'parking-north'
      }
    };
  }

  // 12. Maintenance / Fault Reporting
  if (q.includes('wifi') || q.includes('report') || q.includes('broken') || q.includes('issue') || q.includes('maintenance') || q.includes('complaint')) {
    return {
      id,
      text: `I am connected directly to **Amity Campus Operations & Facility Management**. You can log urgent reports for:\n\n• Wi-Fi access point dropped packets\n• Air conditioning and HVAC malfunctions\n• Broken corridor lighting or power sockets\n• Water dispenser filtration or plumbing issues.\n\nTechnicians are dispatched within 20 minutes of verified ticket creation.`,
      suggestedAction: {
        label: 'Log Operations Report',
        type: 'report_issue',
        targetId: 'new-report'
      }
    };
  }

  // 13. General Building Matcher
  const matchedBuilding = INITIAL_BUILDINGS.find(b => 
    b.name.toLowerCase().includes(q) || 
    b.description.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q)
  );

  if (matchedBuilding) {
    const route = calculateCampusRoute('node-north-gate', matchedBuilding.id);
    return {
      id,
      text: `I located **${matchedBuilding.name} (${matchedBuilding.code})**:\n\n• Category: **${matchedBuilding.category.toUpperCase()}**\n• Status: **${matchedBuilding.status.toUpperCase()}** (${matchedBuilding.occupancyPercentage}% occupied)\n• Opening Hours: **${matchedBuilding.openingHours}**\n• Estimated Distance: **${route?.totalDistanceMeters || 350} m**\n• Primary Facilities: ${matchedBuilding.facilities.slice(0, 4).join(', ')}.`,
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
    text: `Greetings. I am **Aria**, your Amity Spatial Campus Twin Intelligence specialist. I can assist you with precise indoor directions, crowd telemetry, facility hours, and reservations.\n\nYou may ask me:\n- *"Where is the hostel and mess?"*\n- *"What are the timings for Student Mart?"*\n- *"Where is College MRC and doctor clinic?"*\n- *"Is the gym or basketball court available?"*\n- *"Where is the football ground?"*\n- *"Find me the nearest computer lab."*`,
    suggestedAction: {
      label: 'Explore Campus Digital Twin',
      type: 'view_building',
      targetId: 'cs-block'
    }
  };
}
