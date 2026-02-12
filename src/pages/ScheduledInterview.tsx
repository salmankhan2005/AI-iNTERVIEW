import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar, Briefcase, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "@/db";
import { interviews, candidateInterviewResults } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { format } from "date-fns";

export default function ScheduledInterview() {
  const navigate = useNavigate();
  const [interviewList, setInterviewList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      // Fetch all interviews
      const results = await db.select().from(interviews).orderBy(desc(interviews.createdAt));

      // For each interview, count candidates
      const interviewsWithCounts = await Promise.all(results.map(async (interview) => {
        const candidates = await db.select({ count: sql<number>`count(distinct ${candidateInterviewResults.candidateEmail})` })
          .from(candidateInterviewResults)
          .where(eq(candidateInterviewResults.interviewId, interview.id as any));

        return {
          ...interview,
          candidateCount: Number(candidates[0]?.count || 0)
        };
      }));

      setInterviewList(interviewsWithCounts);
    } catch (error) {
      console.error("Error loading scheduled interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scheduled Interviews</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Manage and track your active interview sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewList.map((interview) => (
          <Card key={interview.id} className="group border border-border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Created</span>
                  <span className="text-xs font-bold text-gray-600">
                    {format(new Date(interview.createdAt), "dd MMM yyyy")}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                {interview.position}
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 italic">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500">{interview.duration} Min</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border italic ${interview.candidateCount > 0 ? 'bg-green-50 border-green-100 text-green-600' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${interview.candidateCount > 0 ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${interview.candidateCount > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  </span>
                  <span className="text-xs font-bold">{interview.candidateCount} Candidates</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-11 border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                onClick={() =>
                  navigate(`/interview-detail/${interview.id}`)
                }
              >
                View Details <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {interviewList.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No Interviews Scheduled</h3>
            <p className="text-sm text-gray-500 max-w-sm">Create your first interview to start evaluating candidates with AI.</p>
            <Button
              className="mt-6 bg-blue-600 hover:bg-blue-700 rounded-xl px-6"
              onClick={() => navigate('/create-interview')}
            >
              + Create New Interview
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
