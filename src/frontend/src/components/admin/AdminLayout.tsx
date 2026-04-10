import { cn } from "@/lib/utils";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  ChevronRight,
  Cpu,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Zap,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  {
    label: "Students",
    path: "/admin/students",
    icon: Users,
    section: "Management",
  },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Training Cell", path: "/admin/users", icon: Zap },
  {
    label: "Resume Editor",
    path: "/admin/resume",
    icon: FileText,
    section: "Tools",
  },
  { label: "Mock Interview", path: "/admin/interview", icon: MessageSquare },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    section: "System",
  },
];

function SidebarLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      data-ocid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth group",
        isActive
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon
        size={18}
        className={cn(
          "flex-shrink-0 transition-colors duration-200",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      <span className="flex-1 min-w-0 truncate">{item.label}</span>
      {isActive && (
        <ChevronRight size={14} className="text-primary opacity-60" />
      )}
    </Link>
  );
}

export default function AdminLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Group nav items by section
  const sections: { title?: string; items: NavItem[] }[] = [
    {
      items: navItems.filter(
        (i) => !i.section && ["Dashboard", "Analytics"].includes(i.label),
      ),
    },
    {
      title: "Management",
      items: navItems.filter((i) => i.section === "Management"),
    },
    {
      title: "Tools",
      items: navItems.filter(
        (i) => i.section === "Tools" || i.label === "Mock Interview",
      ),
    },
    { title: "System", items: navItems.filter((i) => i.section === "System") },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col bg-card border-r border-border">
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
              Placement Portal
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
          {sections.map(
            (section) =>
              section.items.length > 0 && (
                <div key={section.title ?? "main"}>
                  {section.title && (
                    <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                      {section.title}
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <SidebarLink
                        key={item.path}
                        item={item}
                        isActive={
                          currentPath === item.path ||
                          currentPath.startsWith(`${item.path}/`)
                        }
                      />
                    ))}
                  </div>
                </div>
              ),
          )}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            © {new Date().getFullYear()} Nexus.{" "}
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
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
