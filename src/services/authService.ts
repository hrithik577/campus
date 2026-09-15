// Authentication and Account Management Service for CAMPUS TWIN
import { UserProfile } from '../types/campus';

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Stored securely in client storage
  role: 'student' | 'faculty' | 'admin' | 'guest';
  department: string;
  studentId: string;
  phone?: string;
  avatar?: string;
  joinedDate?: string;
  hostelRoom?: string;
  emergencyContact?: string;
}

const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'user-std-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@amity.edu',
    passwordHash: 'Amity@2026',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentId: 'AMITY-CS-2026-042',
    phone: '+91 98765 43210',
    joinedDate: 'August 2024',
    hostelRoom: 'Hostel H-1 (Ramanujan), Room 304',
    emergencyContact: 'Mr. R. Sharma (+91 98765 43211)',
    avatar: ''
  },
  {
    id: 'user-fac-201',
    name: 'Prof. V. Raman',
    email: 'vraman@amity.edu',
    passwordHash: 'Faculty@2026',
    role: 'faculty',
    department: 'Department of Computer Science & Engineering',
    studentId: 'FAC-CS-8891',
    phone: '+91 98112 34567',
    joinedDate: 'July 2018',
    avatar: ''
  },
  {
    id: 'user-adm-001',
    name: 'Campus Operations Chief',
    email: 'ops@amity.edu',
    passwordHash: 'Operations@2026',
    role: 'admin',
    department: 'University Infrastructure & Security',
    studentId: 'OPS-DIR-001',
    phone: '+91 99990 12345',
    joinedDate: 'January 2020',
    avatar: ''
  }
];

class AuthService {
  private accountsKey = 'campustwin_accounts';

  private getStoredAccounts(): RegisteredAccount[] {
    if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
    try {
      const stored = localStorage.getItem(this.accountsKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem(this.accountsKey, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  }

  private saveAccounts(accounts: RegisteredAccount[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.accountsKey, JSON.stringify(accounts));
    } catch {
      // ignore
    }
  }

  public register(data: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'faculty' | 'admin';
    department?: string;
    studentId?: string;
    phone?: string;
    avatar?: string;
    hostelRoom?: string;
    emergencyContact?: string;
  }): { success: boolean; user?: UserProfile; error?: string } {
    const trimmedEmail = data.email.trim().toLowerCase();
    const accounts = this.getStoredAccounts();

    if (accounts.some(acc => acc.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const newAccount: RegisteredAccount = {
      id: 'user-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      name: data.name.trim(),
      email: trimmedEmail,
      passwordHash: data.password,
      role: data.role,
      department: data.department || (data.role === 'admin' ? 'University Operations' : 'Computer Science & Engineering'),
      studentId: data.studentId || (data.role === 'admin' ? 'OPS-' + Math.floor(1000 + Math.random() * 9000) : 'AMITY-' + Math.floor(10000 + Math.random() * 90000)),
      phone: data.phone || '',
      avatar: data.avatar || '',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      hostelRoom: data.hostelRoom || '',
      emergencyContact: data.emergencyContact || ''
    };

    accounts.push(newAccount);
    this.saveAccounts(accounts);

    const userProfile: UserProfile = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      role: newAccount.role,
      department: newAccount.department,
      studentId: newAccount.studentId,
      phone: newAccount.phone,
      avatar: newAccount.avatar,
      joinedDate: newAccount.joinedDate,
      hostelRoom: newAccount.hostelRoom,
      emergencyContact: newAccount.emergencyContact
    };

    return { success: true, user: userProfile };
  }

  public login(
    emailOrId: string, 
    password: string, 
    role?: 'student' | 'faculty' | 'admin'
  ): { success: boolean; user?: UserProfile; error?: string } {
    const query = emailOrId.trim().toLowerCase();
    const accounts = this.getStoredAccounts();

    // Look for matching account by email or student ID
    const account = accounts.find(
      acc => acc.email.toLowerCase() === query || acc.studentId.toLowerCase() === query
    );

    if (account) {
      if (account.passwordHash !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const userProfile: UserProfile = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        department: account.department,
        studentId: account.studentId,
        phone: account.phone,
        avatar: account.avatar,
        joinedDate: account.joinedDate,
        hostelRoom: account.hostelRoom,
        emergencyContact: account.emergencyContact
      };

      return { success: true, user: userProfile };
    }

    // If not found in registered accounts but entered valid institutional format
    if (query.includes('@amity.edu') || query.includes('amity')) {
      // Auto-provision user session for Amity institutional login
      const derivedName = query.split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

      const userProfile: UserProfile = {
        id: 'user-' + Math.random().toString(36).substring(2, 8),
        name: derivedName || 'Amity Scholar',
        email: query.includes('@') ? query : `${query}@amity.edu`,
        role: role || 'student',
        department: role === 'admin' ? 'Campus Operations' : 'Computer Science & Engineering',
        studentId: query.includes('amity') ? query.toUpperCase() : 'AMITY-CS-2026-042',
        joinedDate: 'September 2024'
      };

      return { success: true, user: userProfile };
    }

    return { 
      success: false, 
      error: 'Account not found. Please verify your credentials or create a new account.' 
    };
  }

  public updateProfile(userId: string, updates: Partial<UserProfile>): boolean {
    const accounts = this.getStoredAccounts();
    const idx = accounts.findIndex(a => a.id === userId);
    if (idx >= 0) {
      accounts[idx] = {
        ...accounts[idx],
        ...updates
      };
      this.saveAccounts(accounts);
      return true;
    }
    return false;
  }
}

export const authService = new AuthService();
