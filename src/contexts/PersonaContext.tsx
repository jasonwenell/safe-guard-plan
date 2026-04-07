import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type PersonaRole = 'ASSISTANT' | 'ASSOCIATE' | 'UNDERWRITER' | 'MASTER';

export interface Persona {
  role: PersonaRole;
  label: string;
  name: string;
  initials: string;
  title: string;
}

export const PERSONAS: Record<PersonaRole, Persona> = {
  ASSISTANT: { role: 'ASSISTANT', label: 'Assistant', name: 'Traci Gamer', initials: 'TG', title: 'UW Assistant' },
  ASSOCIATE: { role: 'ASSOCIATE', label: 'Associate', name: 'Heidi Bouma', initials: 'HB', title: 'UW Associate' },
  UNDERWRITER: { role: 'UNDERWRITER', label: 'Underwriter', name: 'Juice Montezon', initials: 'JM', title: 'Sr. Underwriter' },
  MASTER: { role: 'MASTER', label: 'Master Admin', name: 'Admin User', initials: 'AD', title: 'Platform Admin' },
};

export const ROLE_NAV_ACCESS: Record<PersonaRole, string[]> = {
  ASSISTANT: [
    '/',
    '/pipeline',
    '/rfps',
    '/quote',
    '/email-intake',
  ],
  ASSOCIATE: [
    '/',
    '/pipeline',
    '/rfps',
    '/quote',
  ],
  UNDERWRITER: [
    '/',
    '/pipeline',
    '/rfps',
    '/quote',
    '/factor-lookup',
    '/policies',
    '/analytics',
  ],
  MASTER: [
    '/',
    '/pipeline',
    '/rfps',
    '/quote',
    '/email-intake',
    '/factor-lookup',
    '/policies',
    '/analytics',
    '/carrier-capacity',
    '/admin',
  ],
};

interface PersonaContextValue {
  persona: Persona;
  role: PersonaRole;
  setRole: (role: PersonaRole) => void;
  hasAccess: (path: string) => boolean;
}

const PersonaContext = createContext<PersonaContextValue | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<PersonaRole>('MASTER');
  const persona = PERSONAS[role];

  const hasAccess = (path: string) => {
    const allowed = ROLE_NAV_ACCESS[role];
    return allowed.some(p => {
      if (p === '/') return path === '/';
      return path === p || path.startsWith(p + '/');
    });
  };

  return (
    <PersonaContext.Provider value={{ persona, role, setRole, hasAccess }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}
