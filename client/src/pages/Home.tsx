import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, BarChart3, Lock, AlertTriangle, Eye } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1629] to-[#0a0e27]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-[#1a2847]">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Shield className="w-8 h-8 text-[#00ff88]" />
            <span className="text-[#00ff88]">PhishShield</span>
            <span className="text-[#00d9ff]">AI</span>
          </div>
          <a href={getLoginUrl()}>
            <Button className="bg-[#00ff88] text-[#0a0e27] hover:bg-[#00e67e] font-bold">
              Sign In
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-96 h-96 bg-[#00ff88] rounded-full opacity-5 blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div
            className="absolute right-0 w-96 h-96 bg-[#00d9ff] rounded-full opacity-5 blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
        </div>

        <div className="container relative z-10 text-center">
          <div className="animate-fade-in space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Detect <span className="text-[#00ff88]">Deepfakes</span> &
              <br />
              <span className="text-[#00d9ff]">Voice Clones</span>
            </h1>

            <p className="text-xl text-[#cbd5e0] max-w-2xl mx-auto">
              Protect yourself and your organization from AI-generated fraud. PhishShield AI uses
              advanced machine learning to identify manipulated audio and video content in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <a href={getLoginUrl()}>
                <Button className="bg-[#00ff88] text-[#0a0e27] hover:bg-[#00e67e] font-bold text-lg px-8 py-6 flex items-center gap-2 w-full sm:w-auto">
                  Try Detector Now <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Button
                variant="outline"
                className="border-[#00d9ff] text-[#00d9ff] hover:bg-[#00d9ff] hover:text-[#0a0e27] font-bold text-lg px-8 py-6 w-full sm:w-auto"
              >
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-16 max-w-2xl mx-auto">
              <div className="glass-card">
                <div className="text-2xl font-bold text-[#00ff88]">99.2%</div>
                <div className="text-sm text-[#cbd5e0]">Detection Accuracy</div>
              </div>
              <div className="glass-card">
                <div className="text-2xl font-bold text-[#00d9ff]">50ms</div>
                <div className="text-sm text-[#cbd5e0]">Avg Analysis Time</div>
              </div>
              <div className="glass-card">
                <div className="text-2xl font-bold text-[#00ff88]">10K+</div>
                <div className="text-sm text-[#cbd5e0]">Scans Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card group hover:border-[#00ff88] animate-fade-in">
              <Eye className="w-10 h-10 text-[#00ff88] mb-4" />
              <h3 className="text-xl font-bold mb-2">Visual Analysis</h3>
              <p className="text-[#cbd5e0]">
                Detects facial artifacts, unnatural blinking patterns, and deepfake markers in video
                content
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card group hover:border-[#00d9ff] animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <Zap className="w-10 h-10 text-[#00d9ff] mb-4" />
              <h3 className="text-xl font-bold mb-2">Audio Detection</h3>
              <p className="text-[#cbd5e0]">
                Analyzes voice patterns, frequency anomalies, and AI cloning signatures in audio files
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card group hover:border-[#00ff88] animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <BarChart3 className="w-10 h-10 text-[#00ff88] mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-Time Analytics</h3>
              <p className="text-[#cbd5e0]">
                Track threat trends, scan history, and get detailed confidence scores for each analysis
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card group hover:border-[#00d9ff] animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Lock className="w-10 h-10 text-[#00d9ff] mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Storage</h3>
              <p className="text-[#cbd5e0]">
                All uploaded files are encrypted and stored securely with enterprise-grade protection
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card group hover:border-[#00ff88] animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <AlertTriangle className="w-10 h-10 text-[#ff4757] mb-4" />
              <h3 className="text-xl font-bold mb-2">Threat Scoring</h3>
              <p className="text-[#cbd5e0]">
                Comprehensive threat assessment with confidence levels and plain-language explanations
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card group hover:border-[#00d9ff] animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Shield className="w-10 h-10 text-[#00d9ff] mb-4" />
              <h3 className="text-xl font-bold mb-2">Demo Mode</h3>
              <p className="text-[#cbd5e0]">
                Explore with pre-loaded samples without uploading files. Perfect for testing and learning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-gradient-to-r from-[#00ff88]/5 to-[#00d9ff]/5 border-y border-[#1a2847]">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12">The Growing Threat</h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-[#cbd5e0]">
                AI-powered deepfakes and voice cloning attacks are rapidly increasing across the globe. In
                the USA, UK, and Europe, criminals are using sophisticated AI tools to:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#00ff88] font-bold">✓</span>
                  <span className="text-[#cbd5e0]">Impersonate executives for financial fraud</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00ff88] font-bold">✓</span>
                  <span className="text-[#cbd5e0]">Create fake videos for blackmail and extortion</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00ff88] font-bold">✓</span>
                  <span className="text-[#cbd5e0]">Clone voices for unauthorized transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00ff88] font-bold">✓</span>
                  <span className="text-[#cbd5e0]">Manipulate media for misinformation campaigns</span>
                </li>
              </ul>

              <p className="text-lg text-[#cbd5e0]">
                PhishShield AI empowers organizations to detect and prevent these threats before they cause
                damage.
              </p>
            </div>

            <div className="glass-card border-[#ff4757]/30 bg-[#ff4757]/5">
              <div className="space-y-4">
                <div className="text-3xl font-bold text-[#ff4757]">⚠️ Critical Risk</div>
                <p className="text-[#cbd5e0]">
                  Without proper detection, deepfakes can lead to:
                </p>
                <ul className="space-y-2 text-[#cbd5e0]">
                  <li>• Financial losses exceeding millions</li>
                  <li>• Reputational damage</li>
                  <li>• Legal liability</li>
                  <li>• Loss of customer trust</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Protect Your Organization?</h2>
          <p className="text-xl text-[#cbd5e0] max-w-2xl mx-auto">
            Start detecting deepfakes and voice clones today. Get instant threat analysis and detailed
            reports.
          </p>

          <a href={getLoginUrl()}>
            <Button className="bg-[#00ff88] text-[#0a0e27] hover:bg-[#00e67e] font-bold text-lg px-10 py-6 flex items-center gap-2 mx-auto">
              Get Started Now <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2847] py-8">
        <div className="container text-center text-[#4a5568]">
          <p>&copy; 2026 PhishShield AI. All rights reserved. | Protecting against deepfake threats</p>
        </div>
      </footer>
    </div>
  );
}
