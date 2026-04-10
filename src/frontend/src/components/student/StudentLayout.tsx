import { clearSession, loadSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  BarChart3,
  ChevronRight,
  Cpu,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Mic2,
  ScrollText,
  User,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Profile", path: "/student/profile", icon: User },
  { label: "Applications", path: "/student/applications", icon: FileText },
  { label: "Interview Prep", path: "/student/interview-prep", icon: Mic2 },
  { label: "Mock Interview", path: "/student/mock-interview", icon: Video },
  { label: "Analytics", path: "/student/analytics", icon: BarChart3 },
  { label: "AI Resume", path: "/student/resume", icon: ScrollText },
];

function SidebarLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      data-ocid={`student-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth group",
        isActive
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon
        size={17}
        className={cn(
          "flex-shrink-0 transition-colors duration-200",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      <span className="flex-1 min-w-0 truncate">{item.label}</span>
      {isActive && (
        <ChevronRight size={13} className="text-primary opacity-60" />
      )}
    </Link>
  );
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const session = loadSession();

  function handleLogout() {
    clearSession();
    void navigate({ to: "/login" });
  }

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <Cpu size={16} className="text-primary-foreground" />
        </div>
        <div>
          <span className="text-base font-bold text-foreground tracking-tight">
            Nexus
          </span>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
            Student Portal
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => (
          <SidebarLink
            key={item.path}
            item={item}
            isActive={currentPath.startsWith(item.path)}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-border space-y-2">
        {session && (
          <div className="px-2 py-2 rounded-lg bg-muted/50">
            <p className="text-xs font-medium text-foreground truncate">
              {session.name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              Roll: {session.rollNumber ?? session.userId}
            </p>
            {session.department && (
              <p className="text-[10px] text-primary/70 truncate mt-0.5">
                {session.department} · B.Tech
              </p>
            )}
          </div>
        )}
        <button
          type="button"
          data-ocid="btn-student-logout"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth"
        >
          <LogOut size={16} className="flex-shrink-0" />
          <span>Log out</span>
        </button>
        <p className="text-[10px] text-muted-foreground/50 text-center">
          © {new Date().getFullYear()}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden cursor-default"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 flex-col flex md:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent onNavClick={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Cpu size={14} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-sm">Nexus</span>
          </div>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            data-ocid="btn-mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-background min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
