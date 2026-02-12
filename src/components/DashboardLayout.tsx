import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, CreditCard, Settings, LogOut } from "lucide-react";

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-card/80">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="md:hidden" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Welcome Back, {user?.displayName?.split(" ")[0] || "User"}
                </h2>
                <p className="text-sm text-muted-foreground">AI-Driven Interviews, Hassle-Free Hiring</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded-full transition-colors">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20 shadow-sm">
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                      {getInitials(user?.displayName || "")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/billing")} className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-6 lg:p-10 overflow-auto bg-gray-50/30">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
