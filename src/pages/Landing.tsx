import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Video, Phone, Users, BarChart3, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const features = [
  {
    icon: Video,
    title: "AI Voice Interviews",
    description: "Conduct automated voice interviews with candidates using advanced AI technology.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Get detailed feedback reports with scoring on technical skills and cultural fit.",
  },
  {
    icon: Shield,
    title: "Bias-Free Hiring",
    description: "Standardized interview process that reduces unconscious bias in hiring decisions.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleGetStarted = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Mic className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground">
            AI<span className="text-primary">cruiter</span>
          </span>
        </div>
        <Button variant="hero" size="lg" onClick={handleGetStarted}>
          Get Started <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              AI-Powered{" "}
              <span className="text-primary">Interview Assistant</span>{" "}
              for Modern Recruiters
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Let our AI voice agent conduct candidate interviews while you focus on finding the perfect match. Save time, reduce bias, and improve your hiring process.
            </p>
            <div className="mt-8 flex gap-4">
              <Button variant="hero" size="lg" onClick={handleGetStarted}>
                Create Interview <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="hero-outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-foreground">Welcome back, Sarah</p>
                <p className="text-xs text-muted-foreground">AI-Driven Interviews, Hassle-Free Hiring</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">S</span>
              </div>
            </div>
            <p className="font-bold text-foreground mb-3">Dashboard</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-border rounded-lg p-3">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center mb-2">
                  <Video className="h-4 w-4 text-accent-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Create New Interview</p>
                <p className="text-xs text-muted-foreground">Create AI Interviews and schedule them</p>
              </div>
              <div className="border border-border rounded-lg p-3">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center mb-2">
                  <Phone className="h-4 w-4 text-accent-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Create Phone Screening</p>
                <p className="text-xs text-muted-foreground">Schedule phone screening calls</p>
              </div>
            </div>
            <p className="font-semibold text-foreground text-sm mb-2">Previously Created Interviews</p>
            <div className="border border-border rounded-lg p-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Full Stack Developer</p>
                <p className="text-xs text-muted-foreground">30 Min</p>
              </div>
              <p className="text-xs text-muted-foreground">20 Oct 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Streamline Your Hiring Process</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            AiCruiter helps you save time and find better candidates with our advanced AI interview technology.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover-scale">
              <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
