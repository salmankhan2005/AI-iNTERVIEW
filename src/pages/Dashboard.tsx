import { Video, Copy, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

const mockInterviews = [
  { id: "1", title: "Full Stack React Developer", duration: "15 Min", date: "07 Apr 2025", color: "bg-primary" },
  { id: "2", title: "Backend Node.js Engineer", duration: "30 Min", date: "12 Mar 2025", color: "bg-orange-500" },
  { id: "3", title: "UI/UX Designer", duration: "15 Min", date: "28 Feb 2025", color: "bg-emerald-500" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userInterviews, setUserInterviews] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      db.select().from(interviews).where(eq(interviews.userId, user.uid)).then(setUserInterviews);
    }
  }, [user]);

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/interview/${id}`);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate("/create-interview")}
          className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-md transition-shadow"
        >
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-3">
            <Video className="h-5 w-5 text-accent-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">Create New Interview</h3>
          <p className="text-sm text-muted-foreground mt-1">Create AI Interviews and schedule them with Candidates</p>
        </button>
      </div>

      {/* Previously Created */}
      <h2 className="text-xl font-bold text-foreground mb-4">Previously Created Interviews</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userInterviews.length > 0 ? userInterviews.map((interview) => (
          <div key={interview.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">{new Date(interview.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="font-semibold text-foreground">{interview.position}</h3>
            <p className="text-sm text-muted-foreground mb-4">{interview.duration} Min</p>
            <div className="flex gap-2">
              <Button onClick={() => handleCopyLink(interview.id)} variant="outline" size="sm" className="flex-1">
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Link
              </Button>
              <Button variant="send" size="sm" className="flex-1">
                <Send className="h-3.5 w-3.5 mr-1.5" /> Send
              </Button>
            </div>
          </div>
        )) : mockInterviews.map((interview) => (
          <div key={interview.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`h-10 w-10 rounded-full ${interview.color}`} />
              <span className="text-xs text-muted-foreground">{interview.date}</span>
            </div>
            <h3 className="font-semibold text-foreground">{interview.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{interview.duration}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Link
              </Button>
              <Button variant="send" size="sm" className="flex-1">
                <Send className="h-3.5 w-3.5 mr-1.5" /> Send
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
