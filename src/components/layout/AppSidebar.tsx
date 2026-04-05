import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Mail, Users, Layers, Calculator,
  FileOutput, Shield, RefreshCw, BarChart3, Settings, ChevronLeft,
  ChevronRight, Zap
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'RFP Quote Log', icon: FileText, path: '/rfps' },
  { label: 'Email Intake', icon: Mail, path: '/email-intake', badge: '4' },
  { label: 'Census', icon: Users, path: '/census' },
  { label: 'Plan Design', icon: Layers, path: '/plan-design' },
  { label: 'Rating Engine', icon: Calculator, path: '/rating' },
  { label: 'Proposals', icon: FileOutput, path: '/proposals' },
  { label: 'Policies', icon: Shield, path: '/policies' },
  { label: 'Renewals', icon: RefreshCw, path: '/renewals' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Admin', icon: Settings, path: '/admin' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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

      {/* User & Collapse */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 px-1 mb-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-hover flex items-center justify-center text-xs font-medium text-sidebar-accent-foreground">
              TG
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-sidebar-accent-foreground truncate">Traci Gamer</span>
              <span className="text-[10px] text-sidebar-foreground opacity-60">UW Assistant</span>
            </div>
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
