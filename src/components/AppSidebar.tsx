import { LayoutDashboard, CalendarDays, List, CreditCard, Settings, Plus, Mic } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Scheduled Interview", url: "/scheduled", icon: CalendarDays },
  { title: "All Interview", url: "/interviews", icon: List },
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar className="w-64 border-r border-border bg-sidebar">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <Mic className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground">
            AI<span className="text-primary">cruiter</span>
          </span>
        </div>

        <Button
          onClick={() => navigate("/create-interview")}
          className="w-full mb-6"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Interview
        </Button>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
