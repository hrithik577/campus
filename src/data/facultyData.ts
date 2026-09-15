import { Faculty, ClassroomRecord } from '../types/campus';

export const FACULTY_MEMBERS: Faculty[] = [
  {
    id: 'f1',
    name: 'Anugha',
    designation: 'Assistant Professor',
    subject: 'Data Structures & Algorithms',
    department: 'Computer Science & Engineering',
    isAvailable: true,
    availabilityStatus: 'available',
    avatarColor: 'bg-violet-600',
    roomId: 'fr-ab2-217',
    roomNo: '217',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 2,
    officeHours: '02:00 PM - 04:30 PM',
    email: 'anugha.cs@amity.edu',
    phone: '+91 98765 21701',
    scheduleToday: [
      { time: '09:00 AM - 10:30 AM', label: 'CS201 Data Structures (Room 217)', type: 'class', roomNumber: '217' },
      { time: '11:00 AM - 01:00 PM', label: 'Research & Lab Mentoring', type: 'office_hours', roomNumber: '217' },
      { time: '02:00 PM - 03:30 PM', label: 'Open Student Consultations', type: 'free', roomNumber: '217' },
      { time: '04:00 PM - 05:00 PM', label: 'Department Committee Meeting', type: 'meeting', roomNumber: '317' }
    ]
  },
  {
    id: 'f2',
    name: 'Pranav Gaur',
    designation: 'Associate Professor',
    subject: 'Design & Analysis of Algorithms',
    department: 'Computer Science & Engineering',
    isAvailable: false,
    availabilityStatus: 'in_class',
    avatarColor: 'bg-blue-600',
    roomId: 'fr-ab2-217',
    roomNo: '217',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 2,
    officeHours: '03:00 PM - 05:00 PM',
    email: 'pranav.gaur@amity.edu',
    phone: '+91 98765 21702',
    scheduleToday: [
      { time: '10:00 AM - 12:00 PM', label: 'CS302 Advanced Algorithms', type: 'class', roomNumber: '202' },
      { time: '01:30 PM - 03:00 PM', label: 'In Class: Graph Theory Lecture', type: 'class', roomNumber: '301' },
      { time: '03:30 PM - 05:00 PM', label: 'Faculty Office Hours', type: 'office_hours', roomNumber: '217' }
    ]
  },
  {
    id: 'f3',
    name: 'Senthil Jagran',
    designation: 'Professor',
    subject: 'Operating Systems & Distributed Networks',
    department: 'Computer Science & Engineering',
    isAvailable: true,
    availabilityStatus: 'available',
    avatarColor: 'bg-emerald-600',
    roomId: 'fr-ab2-217',
    roomNo: '217',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 2,
    officeHours: '11:00 AM - 01:00 PM & 03:00 PM - 04:30 PM',
    email: 'senthil.j@amity.edu',
    phone: '+91 98765 21703',
    scheduleToday: [
      { time: '09:30 AM - 11:00 AM', label: 'OS Kernel Internals Seminar', type: 'class', roomNumber: '217' },
      { time: '11:30 AM - 01:30 PM', label: 'Open Cabin Discussions', type: 'free', roomNumber: '217' },
      { time: '02:30 PM - 04:30 PM', label: 'Office Consultations Available', type: 'office_hours', roomNumber: '217' }
    ]
  },
  {
    id: 'f4',
    name: 'Dr. Swathika',
    designation: 'Professor & Research Lead',
    subject: 'Machine Learning & Deep Neural Nets',
    department: 'Artificial Intelligence & Data Science',
    isAvailable: true,
    availabilityStatus: 'available',
    avatarColor: 'bg-rose-600',
    roomId: 'fr-ab2-317',
    roomNo: '317',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 3,
    officeHours: '01:00 PM - 03:30 PM',
    email: 'dr.swathika@amity.edu',
    phone: '+91 98765 31701',
    scheduleToday: [
      { time: '08:30 AM - 10:30 AM', label: 'AI601 Deep Learning Foundations', type: 'class', roomNumber: '317' },
      { time: '11:00 AM - 01:00 PM', label: 'AI Thesis Guidance & Reviews', type: 'office_hours', roomNumber: '317' },
      { time: '01:30 PM - 03:30 PM', label: 'Cabin Available for Students', type: 'free', roomNumber: '317' },
      { time: '04:00 PM - 05:30 PM', label: 'Industry Research Sync', type: 'meeting', roomNumber: '317' }
    ]
  },
  {
    id: 'f5',
    name: 'Rajat Bharadwaj',
    designation: 'Assistant Professor',
    subject: 'Cloud Computing & DevOps Architecture',
    department: 'Computer Science & Engineering',
    isAvailable: false,
    availabilityStatus: 'busy',
    avatarColor: 'bg-orange-600',
    roomId: 'fr-ab2-317',
    roomNo: '317',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 3,
    officeHours: '03:30 PM - 05:00 PM',
    email: 'rajat.b@amity.edu',
    phone: '+91 98765 31702',
    scheduleToday: [
      { time: '10:00 AM - 11:30 AM', label: 'Cloud Microservices Lab', type: 'class', roomNumber: '301' },
      { time: '12:00 PM - 02:00 PM', label: 'Exam Evaluation Session', type: 'busy', roomNumber: '317' },
      { time: '02:30 PM - 04:00 PM', label: 'Docker & K8s Workshop Prep', type: 'busy', roomNumber: '317' },
      { time: '04:15 PM - 05:15 PM', label: 'Student Office Hours', type: 'office_hours', roomNumber: '317' }
    ]
  },
  {
    id: 'f6',
    name: 'Dr. Palle Prathapa Reddy',
    designation: 'Professor & Head of Department',
    subject: 'Database Systems & Big Data Engineering',
    department: 'Computer Science & Engineering',
    isAvailable: false,
    availabilityStatus: 'busy',
    avatarColor: 'bg-cyan-700',
    roomId: 'fr-ab2-201',
    roomNo: '201',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 2,
    officeHours: '04:00 PM - 05:30 PM (By Appointment)',
    email: 'hod.cs@amity.edu',
    phone: '+91 98765 20101',
    scheduleToday: [
      { time: '09:00 AM - 11:30 AM', label: 'Dean Academic Council Meeting', type: 'meeting', roomNumber: 'Admin' },
      { time: '11:45 AM - 01:15 PM', label: 'CS401 Distributed Databases', type: 'class', roomNumber: '201' },
      { time: '02:00 PM - 04:00 PM', label: 'HOD Administrative Session', type: 'busy', roomNumber: '201' },
      { time: '04:00 PM - 05:30 PM', label: 'Faculty & Student Office Hours', type: 'office_hours', roomNumber: '201' }
    ]
  },
  {
    id: 'f7',
    name: 'Ashok Babu',
    designation: 'Associate Professor',
    subject: 'Software Engineering & System Design',
    department: 'Information Technology',
    isAvailable: true,
    availabilityStatus: 'available',
    avatarColor: 'bg-teal-600',
    roomId: 'fr-ab2-201',
    roomNo: '201',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 2,
    officeHours: '11:30 AM - 01:30 PM & 03:00 PM - 04:30 PM',
    email: 'ashok.babu@amity.edu',
    phone: '+91 98765 20102',
    scheduleToday: [
      { time: '09:30 AM - 11:00 AM', label: 'Software Architecture Lecture', type: 'class', roomNumber: '201' },
      { time: '11:30 AM - 01:00 PM', label: 'Agile Projects Consultation', type: 'office_hours', roomNumber: '201' },
      { time: '02:00 PM - 03:30 PM', label: 'Available at Cabin', type: 'free', roomNumber: '201' },
      { time: '03:45 PM - 05:00 PM', label: 'Capstone Projects Review', type: 'class', roomNumber: '202' }
    ]
  }
];

export const CLASSROOM_RECORDS: ClassroomRecord[] = [
  {
    id: 'fr-ab2-217',
    roomNumber: '217',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 2,
    type: 'faculty_room',
    capacity: 6,
    facultyIds: ['f1', 'f2', 'f3'],
    currentStatus: 'available',
    availableFrom: 'Now',
    nextClass: '04:00 PM (Meeting in 317)',
    schedule: [
      { time: '09:00 - 10:30 AM', subject: 'Data Structures (Anugha)', facultyName: 'Anugha', status: 'completed' },
      { time: '11:00 - 01:00 PM', subject: 'Cabin Discussions (Senthil Jagran)', facultyName: 'Senthil Jagran', status: 'completed' },
      { time: '01:00 - 03:30 PM', subject: 'Open Cabin & Consultations', facultyName: 'Anugha & Senthil', status: 'ongoing' },
      { time: '03:30 - 05:00 PM', subject: 'Student Office Hours', facultyName: 'Pranav Gaur', status: 'upcoming' }
    ]
  },
  {
    id: 'fr-ab2-317',
    roomNumber: '317',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 3,
    type: 'faculty_room',
    capacity: 6,
    facultyIds: ['f4', 'f5'],
    currentStatus: 'available',
    availableFrom: 'Now',
    nextClass: '04:00 PM (Industry Research Sync)',
    schedule: [
      { time: '08:30 - 10:30 AM', subject: 'Machine Learning Class', facultyName: 'Dr. Swathika', status: 'completed' },
      { time: '11:00 - 01:00 PM', subject: 'AI Research Guidance', facultyName: 'Dr. Swathika', status: 'completed' },
      { time: '01:30 - 03:30 PM', subject: 'Available for Students', facultyName: 'Dr. Swathika', status: 'ongoing' },
      { time: '04:00 - 05:30 PM', subject: 'Industry Research Meeting', facultyName: 'Dr. Swathika & Rajat', status: 'upcoming' }
    ]
  },
  {
    id: 'fr-ab2-201',
    roomNumber: '201',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 2,
    type: 'faculty_room',
    capacity: 8,
    facultyIds: ['f6', 'f7'],
    currentStatus: 'available',
    availableFrom: 'Now',
    nextClass: '03:45 PM (Capstone Review in 202)',
    schedule: [
      { time: '09:30 - 11:00 AM', subject: 'Software Architecture Lecture', facultyName: 'Ashok Babu', status: 'completed' },
      { time: '11:45 - 01:15 PM', subject: 'Distributed Databases Class', facultyName: 'Dr. Palle Prathapa Reddy', status: 'completed' },
      { time: '01:30 - 03:30 PM', subject: 'Consultations & Cabin Open', facultyName: 'Ashok Babu', status: 'ongoing' },
      { time: '04:00 - 05:30 PM', subject: 'HOD Open Hours', facultyName: 'Dr. Palle Prathapa Reddy', status: 'upcoming' }
    ]
  },
  {
    id: 'cr-ab2-202',
    roomNumber: '202',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 2,
    type: 'classroom',
    capacity: 70,
    facultyIds: ['f2', 'f7'],
    currentStatus: 'available',
    availableFrom: 'Now',
    nextClass: '03:45 PM - Capstone Review (Ashok Babu)',
    schedule: [
      { time: '09:00 - 10:30 AM', subject: 'CS204 Database Systems', facultyName: 'Dr. Palle Prathapa Reddy', status: 'completed' },
      { time: '11:00 - 12:30 PM', subject: 'CS302 Design & Analysis', facultyName: 'Pranav Gaur', status: 'completed' },
      { time: '12:30 - 03:45 PM', subject: 'Open Study & Available', status: 'free' },
      { time: '03:45 - 05:15 PM', subject: 'Capstone Projects Review', facultyName: 'Ashok Babu', status: 'upcoming' }
    ]
  },
  {
    id: 'cr-ab2-301',
    roomNumber: '301',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 3,
    type: 'classroom',
    capacity: 65,
    facultyIds: ['f2', 'f5'],
    currentStatus: 'occupied',
    availableFrom: '03:00 PM',
    nextClass: 'Ongoing: Graph Theory Lecture (Pranav Gaur)',
    schedule: [
      { time: '10:00 - 11:30 AM', subject: 'Cloud Microservices Lab', facultyName: 'Rajat Bharadwaj', status: 'completed' },
      { time: '01:30 - 03:00 PM', subject: 'CS302 Graph Theory Lecture', facultyName: 'Pranav Gaur', status: 'ongoing' },
      { time: '03:15 - 04:45 PM', subject: 'Available / Open Study', status: 'free' }
    ]
  },
  {
    id: 'cr-ab2-215',
    roomNumber: '215',
    buildingId: 'ab2-block',
    buildingName: 'AB2 Academic Block',
    block: 'AB2',
    floor: 2,
    type: 'classroom',
    capacity: 60,
    facultyIds: ['f1'],
    currentStatus: 'available',
    availableFrom: 'Now',
    nextClass: 'Tomorrow 09:00 AM',
    schedule: [
      { time: '09:30 - 11:00 AM', subject: 'Object Oriented Programming', facultyName: 'Faculty CSE', status: 'completed' },
      { time: '11:30 - 01:00 PM', subject: 'Digital Logic Seminar', facultyName: 'ECE Dept', status: 'completed' },
      { time: '01:00 - 06:00 PM', subject: 'Available for Self Study', status: 'free' }
    ]
  }
];
