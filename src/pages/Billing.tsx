import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/db";
import { interviews, candidateInterviewResults } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Zap, Users, ListFilter, TrendingUp, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Billing() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalInterviews: 0,
        totalCandidates: 0,
        uniqueCandidates: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadBillingData();
        }
    }, [user]);

    const loadBillingData = async () => {
        try {
            setLoading(true);

            const interviewCount = await db.select({ count: sql<number>`count(*)` })
                .from(interviews)
                .where(eq(interviews.userId, user!.uid));

            const candidateCount = await db.select({ count: sql<number>`count(*)` })
                .from(candidateInterviewResults)
                .innerJoin(interviews, eq(candidateInterviewResults.interviewId, interviews.id))
                .where(eq(interviews.userId, user!.uid));

            const uniqueCandidateCount = await db.select({ count: sql<number>`count(distinct ${candidateInterviewResults.candidateEmail})` })
                .from(candidateInterviewResults)
                .innerJoin(interviews, eq(candidateInterviewResults.interviewId, interviews.id))
                .where(eq(interviews.userId, user!.uid));

            setStats({
                totalInterviews: Number(interviewCount[0]?.count || 0),
                totalCandidates: Number(candidateCount[0]?.count || 0),
                uniqueCandidates: Number(uniqueCandidateCount[0]?.count || 0),
            });
        } catch (error) {
            console.error("Error loading billing data:", error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = [
        { name: "Interviews", value: stats.totalInterviews, limit: 5 },
        { name: "Candidates", value: stats.uniqueCandidates, limit: 10 },
    ];

    const interviewLimit = 5;
    const candidateLimit = 10;
    const interviewProgress = Math.min((stats.totalInterviews / interviewLimit) * 100, 100);
    const candidateProgress = Math.min((stats.uniqueCandidates / candidateLimit) * 100, 100);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Usage</h1>
                    <p className="text-muted-foreground mt-1">Manage your plan and track your real-time usage metrics.</p>
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                    Upgrade to Pro <Zap className="ml-2 h-4 w-4" />
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 border-primary/20 bg-primary/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={80} />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Current Plan
                        </CardTitle>
                        <CardDescription>Free Tier Plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-foreground mb-4">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-3 mb-6">
                            {[
                                "Up to 5 active interviews",
                                "10 unique candidate reports",
                                "Basic AI analysis",
                                "24h support response"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border-border/50 bg-card">
                    <CardHeader>
                        <CardTitle>Usage Statistics</CardTitle>
                        <CardDescription>Visual breakdown of your current account limits.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? "#8B5CF6" : "#10B981"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/50">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ListFilter className="h-4 w-4 text-violet-500" />
                                Interviews Created
                            </CardTitle>
                            <span className="text-sm font-medium">{stats.totalInterviews} / {interviewLimit}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Progress value={interviewProgress} className="h-2 bg-violet-100" indicatorClassName="bg-violet-600" />
                        <p className="text-xs text-muted-foreground mt-3 italic">
                            You have used {Math.round(interviewProgress)}% of your monthly interview quota.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-4 w-4 text-emerald-500" />
                                Unique Candidates
                            </CardTitle>
                            <span className="text-sm font-medium">{stats.uniqueCandidates} / {candidateLimit}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Progress value={candidateProgress} className="h-2 bg-emerald-100" indicatorClassName="bg-emerald-600" />
                        <p className="text-xs text-muted-foreground mt-3 italic">
                            {candidateLimit - stats.uniqueCandidates} spots remaining for unique candidate insights.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
