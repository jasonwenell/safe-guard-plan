import React, { createContext, useContext, useState, ReactNode } from 'react';

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

// Navigation items each role can access (paths)
export const ROLE_NAV_ACCESS: Record<PersonaRole, string[]> = {
  ASSISTANT: ['/', '/pipeline', '/rfps', '/email-intake', '/documents'],
  ASSOCIATE: ['/', '/pipeline', '/rfps', '/census', '/plan-design', '/documents'],
  UNDERWRITER: ['/', '/pipeline', '/rfps', '/underwriting', '/rating', '/proposals', '/policies', '/renewals', '/analytics'],
  MASTER: ['/', '/pipeline', '/rfps', '/underwriting', '/email-intake', '/documents', '/census', '/plan-design', '/rating', '/proposals', '/policies', '/renewals', '/analytics', '/admin'],
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
    // Check exact match or prefix match for detail routes
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
