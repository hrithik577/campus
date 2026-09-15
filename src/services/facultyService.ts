import { Faculty, ClassroomRecord, RoomCurrentStatus, FacultyAvailability } from '../types/campus';
import { FACULTY_MEMBERS, CLASSROOM_RECORDS } from '../data/facultyData';

export class FacultyService {
  private facultyList: Faculty[] = [...FACULTY_MEMBERS];
  private classroomList: ClassroomRecord[] = [...CLASSROOM_RECORDS];

  // ── Faculty Queries ──────────────────────────────────────────
  getAllFaculty(): Faculty[] {
    return this.facultyList;
  }

  getFacultyById(id: string): Faculty | undefined {
    return this.facultyList.find((f) => f.id === id);
  }

  getFacultyByName(name: string): Faculty | undefined {
    const q = name.toLowerCase().trim();
    return this.facultyList.find((f) => 
      f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase())
    );
  }

  getFacultyByRoomNumber(roomNo: string): Faculty[] {
    const cleanNo = roomNo.replace(/\D/g, '');
    return this.facultyList.filter(
      (f) => f.roomNo === roomNo || (cleanNo && f.roomNo?.includes(cleanNo))
    );
  }

  getFacultyByFloor(floor: number): Faculty[] {
    return this.facultyList.filter((f) => f.floor === floor);
  }

  getFacultyByBlock(block: string): Faculty[] {
    const q = block.toLowerCase().trim();
    return this.facultyList.filter(
      (f) => f.block?.toLowerCase() === q || f.buildingName?.toLowerCase().includes(q)
    );
  }

  getAvailableFaculty(): Faculty[] {
    return this.facultyList.filter((f) => f.isAvailable);
  }

  getFacultyAvailability(facultyId: string): {
    isAvailable: boolean;
    status: FacultyAvailability;
    label: string;
    details: string;
  } {
    const f = this.getFacultyById(facultyId);
    if (!f) {
      return {
        isAvailable: false,
        status: 'offline',
        label: 'Offline',
        details: 'Faculty record not found'
      };
    }

    const status = f.availabilityStatus ?? (f.isAvailable ? 'available' : 'busy');
    let label = 'Available';
    let details = 'Currently available at cabin / office';

    if (status === 'busy') {
      label = 'Busy';
      details = 'Engaged in evaluation / meeting';
    } else if (status === 'in_class') {
      label = 'In Class';
      details = 'Currently conducting lecture';
    } else if (status === 'offline') {
      label = 'Offline';
      details = 'Not on campus at this time';
    }

    return {
      isAvailable: f.isAvailable,
      status,
      label,
      details
    };
  }

  // ── Classroom Queries ──────────────────────────────────────────
  getAllClassrooms(): ClassroomRecord[] {
    return this.classroomList;
  }

  getClassroomById(id: string): ClassroomRecord | undefined {
    return this.classroomList.find((c) => c.id === id);
  }

  getClassroomByRoomNumber(roomNumber: string): ClassroomRecord | undefined {
    const cleanNo = roomNumber.replace(/\D/g, '');
    return this.classroomList.find(
      (c) => c.roomNumber === roomNumber || (cleanNo && c.roomNumber === cleanNo)
    );
  }

  getClassroomsByFloor(floor: number): ClassroomRecord[] {
    return this.classroomList.filter((c) => c.floor === floor);
  }

  getClassroomsByBlock(block: string): ClassroomRecord[] {
    const q = block.toLowerCase().trim();
    return this.classroomList.filter((c) => c.block.toLowerCase() === q);
  }

  getAvailableClassrooms(): ClassroomRecord[] {
    return this.classroomList.filter((c) => c.currentStatus === 'available');
  }

  getFacultyForRoom(roomIdOrNumber: string): Faculty[] {
    const room = this.getClassroomById(roomIdOrNumber) || this.getClassroomByRoomNumber(roomIdOrNumber);
    if (room) {
      return this.facultyList.filter((f) => room.facultyIds.includes(f.id));
    }
    return this.getFacultyByRoomNumber(roomIdOrNumber);
  }

  getClassroomSchedule(roomIdOrNumber: string) {
    const room = this.getClassroomById(roomIdOrNumber) || this.getClassroomByRoomNumber(roomIdOrNumber);
    return room?.schedule ?? [];
  }

  getNearbyClassrooms(roomId: string): ClassroomRecord[] {
    const target = this.getClassroomById(roomId);
    if (!target) return this.classroomList.slice(0, 3);
    return this.classroomList
      .filter((c) => c.id !== roomId && c.block === target.block && c.floor === target.floor)
      .concat(this.classroomList.filter((c) => c.id !== roomId && c.block === target.block && c.floor !== target.floor))
      .slice(0, 3);
  }

  // ── Search across Faculty & Classrooms ──────────────────────────
  search(query: string): {
    faculty: Faculty[];
    classrooms: ClassroomRecord[];
  } {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        faculty: this.facultyList,
        classrooms: this.classroomList
      };
    }

    const matchedFaculty = this.facultyList.filter((f) =>
      f.name.toLowerCase().includes(q) ||
      (f.subject && f.subject.toLowerCase().includes(q)) ||
      f.designation.toLowerCase().includes(q) ||
      (f.roomNo && f.roomNo.toLowerCase().includes(q)) ||
      (f.block && f.block.toLowerCase().includes(q)) ||
      (f.department && f.department.toLowerCase().includes(q))
    );

    const matchedClassrooms = this.classroomList.filter((c) =>
      c.roomNumber.toLowerCase().includes(q) ||
      c.block.toLowerCase().includes(q) ||
      c.buildingName.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) ||
      this.getFacultyForRoom(c.id).some((f) => f.name.toLowerCase().includes(q))
    );

    return {
      faculty: matchedFaculty,
      classrooms: matchedClassrooms
    };
  }
}

export const facultyService = new FacultyService();
