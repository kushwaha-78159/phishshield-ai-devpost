import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Shield, Zap, BarChart3, Lock, AlertTriangle, Eye } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 accent-green" />
            <span className="text-xl font-bold accent-green">PhishShield AI</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button
                onClick={() => setLocation("/dashboard")}
                className="bg-[#00ff00] text-black font-bold hover:shadow-[0_0_20px_#00ff00]"
              >
                Dashboard
              </Button>
            ) : (
            <Button
              onClick={() => {
                const url = getLoginUrl();
                window.location.href = url;
              }}
              className="bg-[#00ff00] text-black font-bold hover:shadow-[0_0_20px_#00ff00]"
            >
              Sign In
            </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00ff00] via-transparent to-[#00ffff]" />
        </div>

        <div className="container relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ff00] bg-[#00ff00]/10">
            <AlertTriangle className="w-4 h-4 accent-green" />
            <span className="text-sm accent-green">AI-Powered Threat Detection</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Detect <span className="accent-green">Deepfakes</span> & <span className="accent-cyan">Voice Clones</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Protect yourself and your organization from AI-generated fraud. PhishShield AI uses advanced machine learning to identify manipulated audio and video content in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-[#00ff00] text-black font-bold text-lg px-8 hover:shadow-[0_0_30px_#00ff00] transition-all duration-300"
            >
              Try Detector Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#00ffff] text-[#00ffff] font-bold text-lg px-8 hover:bg-[#00ffff]/10"
            >
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12">
            <div className="p-4 rounded-lg border border-[#00ff00]/30 bg-[#00ff00]/5">
              <div className="text-2xl md:text-3xl font-bold accent-green">99.2%</div>
              <div className="text-sm text-muted-foreground">Detection Accuracy</div>
            </div>
            <div className="p-4 rounded-lg border border-[#00ffff]/30 bg-[#00ffff]/5">
              <div className="text-2xl md:text-3xl font-bold accent-cyan">50ms</div>
              <div className="text-sm text-muted-foreground">Avg Analysis Time</div>
            </div>
            <div className="p-4 rounded-lg border border-[#00ff00]/30 bg-[#00ff00]/5">
              <div className="text-2xl md:text-3xl font-bold accent-green">10K+</div>
              <div className="text-sm text-muted-foreground">Scans Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered tools to detect and analyze deepfakes and voice clones
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="p-6 border-[#00ff00]/30 bg-card hover:border-[#00ff00]/60 transition-colors">
              <div className="mb-4 w-12 h-12 rounded-lg bg-[#00ff00]/20 flex items-center justify-center">
                <Eye className="w-6 h-6 accent-green" />
              </div>
              <h3 className="text-lg font-bold mb-2 accent-green">Visual Analysis</h3>
              <p className="text-muted-foreground">
                Detects facial artifacts, unnatural blinking patterns, and deepfake markers in video content
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 border-[#00ffff]/30 bg-card hover:border-[#00ffff]/60 transition-colors">
              <div className="mb-4 w-12 h-12 rounded-lg bg-[#00ffff]/20 flex items-center justify-center">
                <Zap className="w-6 h-6 accent-cyan" />
              </div>
              <h3 className="text-lg font-bold mb-2 accent-cyan">Audio Detection</h3>
              <p className="text-muted-foreground">
                Analyzes voice patterns, frequency anomalies, and AI cloning signatures in audio files
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 border-[#00ff00]/30 bg-card hover:border-[#00ff00]/60 transition-colors">
              <div className="mb-4 w-12 h-12 rounded-lg bg-[#00ff00]/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 accent-green" />
              </div>
              <h3 className="text-lg font-bold mb-2 accent-green">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Track threat trends, scan history, and get detailed confidence scores for each analysis
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 border-[#00ffff]/30 bg-card hover:border-[#00ffff]/60 transition-colors">
              <div className="mb-4 w-12 h-12 rounded-lg bg-[#00ffff]/20 flex items-center justify-center">
                <Lock className="w-6 h-6 accent-cyan" />
              </div>
              <h3 className="text-lg font-bold mb-2 accent-cyan">Secure Storage</h3>
              <p className="text-muted-foreground">
                All uploaded files are encrypted and stored securely with enterprise-grade protection
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 border-[#00ff00]/30 bg-card hover:border-[#00ff00]/60 transition-colors">
              <div className="mb-4 w-12 h-12 rounded-lg bg-[#00ff00]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 accent-green" />
              </div>
              <h3 className="text-lg font-bold mb-2 accent-green">Threat Scoring</h3>
              <p className="text-muted-foreground">
                Comprehensive threat assessment with confidence levels and plain-language explanations
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 border-[#00ffff]/30 bg-card hover:border-[#00ffff]/60 transition-colors">
              <div className="mb-4 w-12 h-12 rounded-lg bg-[#00ffff]/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 accent-cyan" />
              </div>
              <h3 className="text-lg font-bold mb-2 accent-cyan">Demo Mode</h3>
              <p className="text-muted-foreground">
                Explore with pre-loaded samples without uploading files. Perfect for testing and learning
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 px-4 border-t border-border bg-card/30">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 accent-green">The Growing Threat</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              AI-powered deepfakes and voice cloning attacks are rapidly increasing across the globe. In the USA, UK, and Europe, criminals are using sophisticated AI tools to:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-3">
                <span className="accent-green">•</span>
                <span>Impersonate executives to steal millions in fraudulent wire transfers</span>
              </li>
              <li className="flex gap-3">
                <span className="accent-cyan">•</span>
                <span>Clone employee voices to bypass security protocols and access sensitive data</span>
              </li>
              <li className="flex gap-3">
                <span className="accent-green">•</span>
                <span>Create fake video calls with perfect facial replicas to manipulate victims</span>
              </li>
              <li className="flex gap-3">
                <span className="accent-cyan">•</span>
                <span>Spread disinformation and manipulate public opinion through synthetic media</span>
              </li>
            </ul>
            <p className="mt-4">
              PhishShield AI provides the defense you need to identify and stop these attacks before they cause damage.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Organization?</h2>
          <p className="text-muted-foreground mb-8">
            Start detecting deepfakes and voice clones today. No credit card required.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-[#00ff00] text-black font-bold text-lg px-8 hover:shadow-[0_0_30px_#00ff00] transition-all duration-300"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 px-4">
        <div className="container text-center text-muted-foreground text-sm">
          <p>&copy; 2026 PhishShield AI. All rights reserved. Protecting against AI-powered fraud.</p>
        </div>
      </footer>
    </div>
  );
}
