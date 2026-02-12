import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, User, ShieldCheck, Keyboard, LogOut, Bell, Key } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    const getInitials = (name: string | null) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <div className="border-b border-border pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    <SettingsIcon className="h-8 w-8 text-primary" />
                    Settings
                </h1>
                <p className="text-muted-foreground mt-1">Manage your professional profile and application preferences.</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <User className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Profile Information</h2>
                    </div>
                    <Card className="border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="relative group">
                                    <Avatar className="h-24 w-24 ring-4 ring-background border-2 border-primary/20 shadow-xl transition-transform group-hover:scale-105">
                                        <AvatarImage src={user?.photoURL || ""} />
                                        <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                                            {getInitials(user?.displayName || "")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <span className="text-[10px] text-white font-bold uppercase">Change</span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6 w-full">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground ml-1">Full Name</Label>
                                            <Input id="name" defaultValue={user?.displayName || ""} className="bg-background/80" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-bold uppercase text-muted-foreground ml-1">Email Address</Label>
                                            <Input id="email" defaultValue={user?.email || ""} readOnly className="bg-muted text-muted-foreground border-dashed" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <Button variant="outline" className="px-6 rounded-xl">Discard</Button>
                                        <Button className="px-8 rounded-xl bg-primary hover:bg-primary/90">Save Changes</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Integration Status */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                Integration Health
                            </CardTitle>
                            <CardDescription>Monitor your active service connections.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-sm font-medium">Vapi Voice AI</span>
                                </div>
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-sm font-medium">Groq Feedback Engine</span>
                                </div>
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none">Stable</Badge>
                            </div>
                            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:bg-muted py-1" onClick={() => toast.info("Keys are managed in environment variables")}>
                                <Key className="h-3 w-3 mr-2" /> View API Configuration
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Preferences */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bell className="h-4 w-4 text-amber-500" />
                                Notifications
                            </CardTitle>
                            <CardDescription>Stay updated on candidate performance.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium">Email Reports</div>
                                    <div className="text-xs text-muted-foreground">Receive PDF report after each interview</div>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-lg">Enabled</Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium">Daily Summary</div>
                                    <div className="text-xs text-muted-foreground">Get a consolidated notification daily</div>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-lg">Disabled</Button>
                            </div>
                            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:bg-muted py-1">
                                <Keyboard className="h-3 w-3 mr-2" /> Configure Shortcuts
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Danger Zone */}
                <section className="pt-4 border-t border-border">
                    <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-red-600">Session Management</h3>
                            <p className="text-sm text-red-600/70">Securely sign out of your current session on this device.</p>
                        </div>
                        <Button
                            variant="destructive"
                            className="px-8 rounded-xl font-bold bg-red-600 hover:bg-red-700 transition-all flex items-center gap-2"
                            onClick={handleLogout}
                        >
                            Sign Out <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
