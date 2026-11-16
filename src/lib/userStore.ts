import { AdminUser } from '../types';

export const USERS_STORAGE_KEY = 'stayaura_registered_users';

export const INITIAL_GUEST_USERS: AdminUser[] = [
  {
    id: 'user_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98201 12345',
    status: 'approved',
    role: 'customer',
    registeredAt: '2026-02-15 10:30',
    joinedDate: 'Feb 2026',
    lastLogin: '2026-11-14 18:20'
  },
  {
    id: 'user_2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98302 23456',
    status: 'approved',
    role: 'customer',
    registeredAt: '2026-03-01 14:15',
    joinedDate: 'Mar 2026',
    lastLogin: '2026-11-15 09:45'
  },
  {
    id: 'user_3',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '+91 98403 34567',
    status: 'pending',
    role: 'customer',
    registeredAt: '2026-03-10 16:00',
    joinedDate: 'Mar 2026',
    lastLogin: '2026-11-16 11:10'
  },
  {
    id: 'user_4',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    phone: '+91 98504 45678',
    status: 'approved',
    role: 'customer',
    registeredAt: '2026-03-12 11:20',
    joinedDate: 'Mar 2026',
    lastLogin: '2026-11-16 14:05'
  }
];

export function getStoredUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return INITIAL_GUEST_USERS;
}

export function saveStoredUsers(users: AdminUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent('stayaura_users_updated', { detail: users }));
  } catch {}
}

export function recordUserRegistration(user: {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
}): AdminUser {
  const current = getStoredUsers();
  const now = new Date();
  const nowStr = now.toISOString().replace('T', ' ').substring(0, 19);
  const normalizedEmail = user.email.trim().toLowerCase();

  const existingIdx = current.findIndex(
    (u) => u.email.trim().toLowerCase() === normalizedEmail
  );

  let resultUser: AdminUser;

  if (existingIdx >= 0) {
    resultUser = {
      ...current[existingIdx],
      name: user.name.trim() || current[existingIdx].name,
      phone: user.phone?.trim() || current[existingIdx].phone,
      lastLogin: nowStr
    };
    current[existingIdx] = resultUser;
  } else {
    resultUser = {
      id: user.id || `usr_${Date.now()}`,
      name: user.name.trim(),
      email: normalizedEmail,
      phone: user.phone?.trim() || '+91 98765 00000',
      status: user.status || 'approved',
      role: user.role || 'customer',
      registeredAt: nowStr,
      joinedDate: now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      lastLogin: nowStr
    };
    current.unshift(resultUser);
  }

  saveStoredUsers(current);
  return resultUser;
}

export function recordUserLogin(email: string): void {
  try {
    const current = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const existingIdx = current.findIndex(
      (u) => u.email.trim().toLowerCase() === normalizedEmail
    );

    if (existingIdx >= 0) {
      current[existingIdx] = {
        ...current[existingIdx],
        lastLogin: nowStr
      };
      saveStoredUsers(current);
    }
  } catch {}
}
