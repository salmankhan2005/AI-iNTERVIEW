import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Calendar, Settings2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { db } from "@/db";
import { interviews, candidateInterviewResults } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";

export default function InterviewDetail() {
  const { id } = useParams();
  const [interview, setInterview] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const interviewResult = await db.select().from(interviews).where(eq(interviews.id, id as any));
      if (interviewResult[0]) {
        setInterview(interviewResult[0]);
      }

      const candidatesResult = await db
        .select()
        .from(candidateInterviewResults)
        .where(eq(candidateInterviewResults.interviewId, id as any))
        .orderBy(desc(candidateInterviewResults.createdAt));

      setCandidates(candidatesResult);
    } catch (error) {
      console.error("Error loading interview detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const openFeedback = (candidate: any) => {
    setSelectedCandidate(candidate);
    setFeedbackOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!interview) return <div className="p-6 text-center text-muted-foreground">Interview not found</div>;

  let questions = [];
  try {
    questions = typeof interview.questions === 'string'
      ? JSON.parse(interview.questions)
      : (Array.isArray(interview.questions) ? interview.questions : [interview.questions]);
  } catch (e) {
    questions = [interview.questions];
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Interview Detail</h1>

      <Card className="border border-border shadow-sm">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">
            {interview.position}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Duration</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" /> {interview.duration} Min
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created On</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" /> {format(new Date(interview.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-gray-400" /> {interview.interviewTypes || "Technical"}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-3">Job Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {interview.description}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4">Interview Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {questions.map((q: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <span className="text-sm font-medium text-gray-800 shrink-0">{i + 1}.</span>
                  <p className="text-sm text-gray-600 leading-snug">{q}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-10 border-gray-100" />

          <h3 className="font-bold text-gray-800 mb-6">
            Candidates ({candidates.length})
          </h3>

          <div className="space-y-4">
            {candidates.map((c: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/30"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 bg-blue-500">
                    <AvatarFallback className="text-white font-bold">
                      {c.candidateName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-800 leading-none mb-1">{c.candidateName}</p>
                    <p className="text-xs text-gray-400 font-medium">
                      Completed On: {format(new Date(c.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-lg font-bold text-green-500">
                    {c.score || "0"}/10
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-100 hover:bg-blue-50 h-9 px-4 rounded-lg font-semibold"
                    onClick={() => openFeedback(c)}
                  >
                    View Report
                  </Button>
                </div>
              </div>
            ))}
            {candidates.length === 0 && (
              <p className="text-center py-10 text-muted-foreground text-sm font-medium bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No candidates have completed this interview yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-2xl">
          <div className="p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold">Feedback</DialogTitle>
            </DialogHeader>

            {selectedCandidate && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-blue-500">
                      <AvatarFallback className="text-white font-bold text-lg">
                        {selectedCandidate.candidateName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-bold text-gray-800 text-lg leading-tight">
                        {selectedCandidate.candidateName}
                      </p>
                      <p className="text-sm text-gray-400 font-medium">
                        {selectedCandidate.candidateEmail}
                      </p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-blue-600">
                    {selectedCandidate.score || "0"}/10
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-5">Skills Assessment</h4>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    {[
                      { label: "Technical Skills", value: Number(selectedCandidate.technicalSkills) || 0 },
                      { label: "Communication", value: Number(selectedCandidate.communication) || 0 },
                      { label: "Problem Solving", value: Number(selectedCandidate.problemSolving) || 0 },
                      { label: "Experience", value: Number(selectedCandidate.experience) || 0 },
                    ].map((skill) => (
                      <div key={skill.label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500 font-medium">{skill.label}</span>
                          <span className="font-bold text-blue-600">{skill.value}/10</span>
                        </div>
                        <Progress value={skill.value * 10} className="h-2 bg-gray-100" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Performance Summary</h4>
                  <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {selectedCandidate.feedback || "The candidate's performance details are being analyzed."}
                    </p>
                  </div>
                </div>

                <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl p-5 flex items-center justify-between gap-6 shadow-sm">
                  <div className="flex-1">
                    <p className="font-bold text-[#991B1B] text-sm mb-1.5 flex items-center gap-2">
                      Recommendation Msg:
                    </p>
                    <p className="text-sm text-[#B91C1C] leading-snug font-medium">
                      {selectedCandidate.recommendation || "Needs further review."}
                    </p>
                  </div>
                  <Button size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-5 rounded-xl font-bold h-10 shadow-sm">
                    Send Msg
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
