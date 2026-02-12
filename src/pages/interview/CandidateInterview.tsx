import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Phone, Clock, Info, Check, Loader2, SendHorizontal } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { createVapiInstance, getAssistantConfig } from "@/lib/vapiService";
import { db } from "@/db";
import { interviews, candidateInterviewResults } from "@/db/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { generateFeedback } from "@/lib/groq";

export default function CandidateInterview() {
  const { id } = useParams();
  const [interview, setInterview] = useState<any>(null);
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [step, setStep] = useState(1);
  const [isCallActive, setIsCallActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");

  useEffect(() => {
    const vapiInstance = createVapiInstance();
    if (!vapiInstance) {
      toast.error("Vapi Public Key is missing. Check your environment variables.");
      return;
    }
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      console.log("Call started");
      setIsCallActive(true);
    });

    vapiInstance.on("call-end", () => {
      console.log("Call ended");
      setIsCallActive(false);
      setStep(3);
    });

    vapiInstance.on("message", (message: any) => {
      if (message.type === "transcript") {
        if (message.transcriptType === "final") {
          setTranscript(prev => [...prev, `${message.role.toUpperCase()}: ${message.transcript}`]);
          setCurrentTranscript("");
        } else {
          setCurrentTranscript(message.transcript);
        }
      }
    });

    vapiInstance.on("error", (e) => {
      console.error("VAPI ERROR DETECTED", e);
      toast.error("Vapi Encountered an error.");
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  useEffect(() => {
    if (id) {
      db.select()
        .from(interviews)
        .where(eq(interviews.id, id))
        .then((result) => {
          if (result[0]) {
            setInterview(result[0]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("DB Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    if (step === 3 && interview && !isSaving) {
      saveResults();
    }
  }, [step]);

  const saveResults = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const fullTranscript = transcript.join("\n");

      // Generate AI Feedback
      let aiFeedback = {
        score: "0/10",
        technical_skills: 0,
        communication: 0,
        problem_solving: 0,
        experience: 0,
        feedback: "Analysis pending.",
        recommendation: "Needs review."
      };

      try {
        aiFeedback = await generateFeedback(fullTranscript, interview.position, interview.description);
      } catch (e) {
        console.error("AI Feedback error:", e);
      }

      await db.insert(candidateInterviewResults).values({
        interviewId: interview.id as any,
        candidateName,
        candidateEmail,
        transcript: fullTranscript,
        duration: formatTime(timer),
        score: parseInt(String(aiFeedback.score)) || 0,
        technicalSkills: parseInt(String(aiFeedback.technical_skills)) || 0,
        communication: parseInt(String(aiFeedback.communication)) || 0,
        problemSolving: parseInt(String(aiFeedback.problem_solving)) || 0,
        experience: parseInt(String(aiFeedback.experience)) || 0,
        feedback: aiFeedback.feedback,
        recommendation: aiFeedback.recommendation
      });
      toast.success("Interview results analyzed and saved!");
    } catch (error) {
      console.error("Failed to save results:", error);
      toast.error("Failed to save interview results.");
    } finally {
      setIsSaving(false);
    }
  };

  const startInterview = async () => {
    if (!vapi || !interview) return;

    try {
      const config = getAssistantConfig(interview);
      await vapi.start(config as any);
      setStep(2);
    } catch (error) {
      console.error("Vapi start execution error:", error);
      toast.error("Failed to start session.");
    }
  };

  const endInterview = () => {
    if (vapi) vapi.stop();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Interview not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      {/* Navbar to match screenshot */}
      <div className="bg-white border-b px-6 py-2">
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-gray-500" />
          <span className="text-lg font-bold">AI<span className="text-black">cruiter</span></span>
        </div>
      </div>

      {/* Step 1: Enhanced Intro Screen */}
      {step === 1 && (
        <div className="flex items-center justify-center py-10 px-6">
          <div className="max-w-xl w-full bg-white rounded-xl shadow-sm p-10 flex flex-col items-center">
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Mic className="h-6 w-6 text-blue-500" />
                <span className="text-2xl font-bold">AI<span className="text-black">cruiter</span></span>
              </div>
              <p className="text-sm text-gray-500 font-medium">AI-Powered Interview Platform</p>
            </div>

            <div className="my-8">
              <img src="https://illustrations.popsy.co/amber/remote-work.svg" alt="Illustration" className="w-56" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">{interview.position}</h2>
            <div className="flex items-center gap-1.5 text-gray-500 mb-8 font-medium">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{interview.duration} Min</span>
            </div>

            <div className="w-full space-y-4 mb-8">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Enter your full name</label>
                <Input
                  className="bg-white border-gray-200 h-11"
                  placeholder="e.g. Jhon Smith"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Enter your Email</label>
                <Input
                  className="bg-white border-gray-200 h-11"
                  type="email"
                  placeholder="e.g. jhon@gmail.com"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Instruction Box - Matched to Screenshot 1 */}
            <div className="w-full bg-[#E5F1FF] border border-[#B8D9FF] rounded-lg p-5 mb-8">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold text-[#0047B3] mb-1">Before you begin</p>
                  <ul className="space-y-1 text-[#0047B3]">
                    <li>- Test your camera and micrphone</li>
                    <li>- Ensure you have a stable internet connection</li>
                    <li>- Find a Quiet place for interview</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white h-12 text-base font-semibold"
              onClick={startInterview}
              disabled={!candidateName || !candidateEmail}
            >
              Start Interview
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Refined Interview Session - Matched to Screenshot 2 */}
      {step === 2 && (
        <div className="p-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">AI Interview Session</h1>
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Clock className="h-5 w-5" />
              {formatTime(timer)}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* AI Recruiter Card */}
            <div className="bg-white rounded-xl shadow-sm p-10 flex flex-col items-center justify-center min-h-[420px] border border-gray-100 relative">
              <div className="w-20 h-20 rounded-full bg-[#3B82F6] flex items-center justify-center mb-6 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="AI Agent" className="w-full h-full object-cover" />
              </div>
              <p className="font-bold text-gray-700 text-lg mb-2">AI Recruiter</p>
              {currentTranscript && (
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <p className="text-xs text-blue-500 font-medium animate-pulse">Assistant Speaking...</p>
                </div>
              )}
            </div>

            {/* Candidate Card */}
            <div className="bg-white rounded-xl shadow-sm p-10 flex flex-col items-center justify-center min-h-[420px] border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-[#3B82F6] flex items-center justify-center mb-6 text-white text-3xl font-bold shadow-sm">
                {candidateName.charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-gray-700 text-lg">{candidateName}</p>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="w-14 h-14 rounded-full bg-[#64748B] flex items-center justify-center hover:bg-[#475569] transition shadow-lg text-white">
                <Mic className="h-6 w-6" />
              </button>
              <button
                onClick={endInterview}
                className="w-14 h-14 rounded-full bg-[#FF3B30] flex items-center justify-center hover:bg-[#E03126] transition shadow-lg text-white"
              >
                <Phone className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-400 text-sm font-medium">Interview in Progress...</p>
          </div>
        </div>
      )}

      {/* Step 3: Refined Completion Screen - Matched to Screenshot 3 */}
      {step === 3 && (
        <div className="flex items-center justify-center py-10 px-6">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#4ADE80] flex items-center justify-center mb-8 shadow-sm">
              <Check className="h-10 w-10 text-white stroke-[3px]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Interview Complete!</h1>
            <p className="text-gray-500 font-medium mb-10">Thank you for participating in the AI-driven interview with AIcruiter</p>

            <div className="w-full mb-10 overflow-hidden rounded-2xl bg-[#FAF6F3]">
              <img src="https://illustrations.popsy.co/amber/success.svg" alt="Success Illustration" className="w-full h-80 object-contain p-4" />
            </div>

            <div className="pt-2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#0066FF] flex items-center justify-center mb-4 shadow-sm">
                <SendHorizontal className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-3">What's Next?</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                The recruiter will review your interview responses and will contact you soon regarding the next steps.
              </p>
              {isSaving && (
                <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Saving results...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
