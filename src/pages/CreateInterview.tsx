import { useState } from "react";
import { ArrowLeft, ArrowRight, Code, Users, Briefcase, Lightbulb, Award, Loader2, CheckCircle, Copy, Clock, List, Mail, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { generateInterviewQuestions } from "@/lib/groq";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const interviewTypes = [
  { label: "Technical", icon: Code },
  { label: "Behavioral", icon: Users },
  { label: "Experience", icon: Briefcase },
  { label: "Problem Solving", icon: Lightbulb },
  { label: "Leadership", icon: Award },
];

const mockQuestions = [
  { text: "Describe your experience with React.js, highlighting a complex project where you leveraged its features to solve a challenging problem. Focus on specific components, state management, and any performance optimizations you implemented.", type: "Technical/Experience" },
  { text: "Explain the difference between `useState` and `useReducer` in React. When would you choose one over the other? Provide a practical example.", type: "Technical" },
  { text: "How do you handle asynchronous operations and data fetching in React applications? Discuss your preferred methods and their advantages/disadvantages.", type: "Technical" },
  { text: "Let's say you're building a component that displays a list of products fetched from a REST API. Describe how you would handle loading states, error handling, and pagination.", type: "Technical" },
  { text: "How familiar are you with different state management libraries in React (Redux, Context API, Zustand, Recoil)? Describe a situation where you chose one over another and why.", type: "Technical/Experience" },
  { text: "Tell me about a time you had to debug a particularly challenging issue in a React application. What was the problem, how did you approach it, and what did you learn from the experience?", type: "Behavioral/Experience" },
  { text: "Describe your experience with version control using Git. Have you worked with branching strategies like Gitflow? Explain how you handle merge conflicts.", type: "Technical/Experience" },
  { text: "Briefly describe your experience with backend technologies (Node.js/Express or similar). Have you worked on building APIs or contributed to backend codebases?", type: "Technical/Experience" },
  { text: "This role requires collaboration with designers and backend engineers. Tell me about a time you effectively collaborated with a team to solve a problem or ship a feature. What was your role and how did you contribute?", type: "Behavioral/Leadership" },
];

export default function CreateInterview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Technical"]);
  const [interviewId, setInterviewId] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    position: "",
    description: "",
    duration: "",
  });

  const toggleType = (label: string) => {
    setSelectedTypes((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const handleGenerateQuestions = async () => {
    setStep(2);
    setIsGenerating(true);
    try {
      const generated = await generateInterviewQuestions(
        formData.position,
        formData.description,
        selectedTypes
      );
      setQuestions(generated);
    } catch (error) {
      toast.error("Failed to generate questions");
      setQuestions(mockQuestions.map(q => q.text));
    }
    setIsGenerating(false);
  };

  const handleCreateInterview = async () => {
    try {
      const [result] = await db.insert(interviews).values({
        userId: user?.uid || "",
        position: formData.position,
        description: formData.description,
        duration: formData.duration,
        interviewTypes: JSON.stringify(selectedTypes),
        questions: JSON.stringify(questions),
      }).returning();
      
      setInterviewId(result.id);
      setStep(3);
      toast.success("Interview created successfully!");
    } catch (error) {
      toast.error("Failed to create interview");
    }
  };

  const mockInterviewId = interviewId || "942213d8-afa8-4cc5-93c9-3f";
  const interviewLink = `${import.meta.env.VITE_APP_URL || window.location.origin}/interview/${mockInterviewId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(interviewLink);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = (platform: string) => {
    const text = `Join your AI interview for ${formData.position} position`;
    const url = interviewLink;
    
    if (platform === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else {
      toast.info("Share link copied!");
      navigator.clipboard.writeText(url);
    }
  };

  const progressWidth = step === 1 ? "50%" : step === 2 ? "75%" : "100%";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => (step === 2 ? setStep(1) : navigate("/dashboard"))} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Create New Interview</h1>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-8">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: progressWidth }} />
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Job Position</label>
            <Input
              placeholder="e.g. Full Stack Developer"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Job Description</label>
            <Textarea
              placeholder="Enter details job description"
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Interview Duration</label>
            <Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 Minutes</SelectItem>
                <SelectItem value="30">30 Minutes</SelectItem>
                <SelectItem value="45">45 Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Interview Type</label>
            <div className="flex flex-wrap gap-2">
              {interviewTypes.map((type) => {
                const selected = selectedTypes.includes(type.label);
                return (
                  <button
                    key={type.label}
                    onClick={() => toggleType(type.label)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="lg" onClick={handleGenerateQuestions}>
              Generate Question <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          {isGenerating ? (
            <div className="bg-accent border border-primary/20 rounded-xl p-6 flex items-center gap-4">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <div>
                <p className="font-semibold text-foreground">Generating Interview Questions</p>
                <p className="text-sm text-accent-foreground">Our AI is crafting personalized questions based on your job position</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-foreground mb-4">Generated Interview Questions:</h2>
              <div className="space-y-3 mb-6">
                {questions.map((q, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <p className="text-sm text-foreground">{q}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button size="lg" onClick={handleCreateInterview}>
                  Create Interview Link & Finish
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" style={{ color: 'hsl(160, 84%, 39%)' }} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Your AI Interview is Ready!</h2>
          <p className="text-muted-foreground mb-8">Share this link with your candidates to start the interview process</p>

          <div className="bg-card border border-border rounded-xl p-6 text-left mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Interview Link</h3>
              <span className="text-sm text-primary font-medium">Valid for 30 Days</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Input value={interviewLink} readOnly className="flex-1 text-sm text-muted-foreground" />
              <Button onClick={handleCopyLink} variant="default" size="default">
                <Copy className="h-4 w-4 mr-1.5" /> Copy Link
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {formData.duration || "30"} Min</span>
              <span className="flex items-center gap-1"><List className="h-4 w-4" /> {questions.length} Questions</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-foreground mb-3">Share Via</h3>
            <div className="flex gap-3">
              <Button onClick={() => handleShare("slack")} variant="outline" className="flex-1"><MessageSquare className="h-4 w-4 mr-1.5" /> Slack</Button>
              <Button onClick={() => handleShare("email")} variant="outline" className="flex-1"><Mail className="h-4 w-4 mr-1.5" /> Email</Button>
              <Button onClick={() => handleShare("whatsapp")} variant="outline" className="flex-1"><MessageSquare className="h-4 w-4 mr-1.5" /> Whatsapp</Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Dashboard
            </Button>
            <Button onClick={() => { setStep(1); setFormData({ position: "", description: "", duration: "" }); }}>
              <Plus className="h-4 w-4 mr-1.5" /> Create New Interview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
