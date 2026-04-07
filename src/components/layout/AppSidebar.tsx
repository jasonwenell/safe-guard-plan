import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Mail, Calculator,
  Shield, BarChart3, Settings, ChevronLeft,
  ChevronRight, Zap, GitBranch, BookOpen, Building2
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { usePersona, PERSONAS, PersonaRole } from '@/contexts/PersonaContext';

const allNavItems = [
  // Core (all roles)
  { label: 'My Queue', icon: LayoutDashboard, path: '/' },
  { label: 'Pipeline', icon: GitBranch, path: '/pipeline' },
  { label: 'All Quotes', icon: FileText, path: '/rfps' },
  // Assistant only
  { label: 'Email Inbox', icon: Mail, path: '/email-intake', badge: '4' },
  // Underwriter tools
  { label: 'Factor Lookup', icon: BookOpen, path: '/factor-lookup' },
  { label: 'Policies', icon: Shield, path: '/policies' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  // Admin only
  { label: 'Carrier Capacity', icon: Building2, path: '/carrier-capacity' },
  { label: 'Rating Manuals', icon: BookOpen, path: '/admin/rating-manuals' },
  { label: 'Admin', icon: Settings, path: '/admin' },
];

const ROLE_COLORS: Record<PersonaRole, string> = {
  ASSISTANT: 'bg-indigo-500',
  ASSOCIATE: 'bg-teal-500',
  UNDERWRITER: 'bg-amber-500',
  MASTER: 'bg-primary',
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const location = useLocation();
  const { persona, role, setRole, hasAccess } = usePersona();

  const navItems = allNavItems.filter(item => hasAccess(item.path));

  return (
    <aside className={cn(
      "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 h-screen sticky top-0",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-accent-foreground tracking-wide">SLEQ</span>
            <span className="text-[10px] text-sidebar-foreground opacity-60">Platform v1.0</span>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative group",
                isActive
                  ? "bg-sidebar-active/15 text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-accent-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-sidebar-active rounded-r-full" />
              )}
              <item.icon className={cn("w-[18px] h-[18px] shrink-0", isActive && "text-sidebar-active")} />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary/20 text-primary text-xs font-medium px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Role Switcher */}
      <div className="border-t border-sidebar-border p-3 shrink-0 relative">
        {!collapsed && (
          <button
            onClick={() => setShowRolePicker(!showRolePicker)}
            className="w-full flex items-center gap-2 px-1 mb-2 rounded-md hover:bg-sidebar-hover p-1.5 transition-colors"
          >
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0', ROLE_COLORS[role])}>
              {persona.initials}
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-xs font-medium text-sidebar-accent-foreground truncate">{persona.name}</span>
              <span className="text-[10px] text-sidebar-foreground opacity-60">{persona.title}</span>
            </div>
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setShowRolePicker(!showRolePicker)}
            className="w-full flex items-center justify-center mb-2"
          >
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0', ROLE_COLORS[role])}>
              {persona.initials}
            </div>
          </button>
        )}

        {showRolePicker && (
          <div className="absolute bottom-full left-2 right-2 mb-1 bg-card border border-border rounded-lg shadow-lg p-1 z-50">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-1">Switch Persona</p>
            {(Object.keys(PERSONAS) as PersonaRole[]).map(r => {
              const p = PERSONAS[r];
              const isActive = r === role;
              return (
                <button
                  key={r}
                  onClick={() => { setRole(r); setShowRolePicker(false); }}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors text-sm',
                    isActive ? 'bg-primary/10 text-foreground font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white', ROLE_COLORS[r])}>
                    {p.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs">{p.name}</span>
                    <span className="text-[10px] opacity-60">{p.title}</span>
                  </div>
                  {isActive && <span className="ml-auto text-primary text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 rounded-md hover:bg-sidebar-hover text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
