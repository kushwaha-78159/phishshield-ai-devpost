import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BarChart3, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Overview() {
  const [, setLocation] = useLocation();
  const { data: analyticsData, isLoading } = trpc.analytics.getData.useQuery();

  const verdictCounts = (analyticsData?.verdictCounts as any[]) || [];
  const realCount = verdictCounts.find((v: any) => v.verdict === "real")?.count || 0;
  const fakeCount = verdictCounts.find((v: any) => v.verdict === "fake")?.count || 0;
  const suspiciousCount = verdictCounts.find((v: any) => v.verdict === "suspicious")?.count || 0;
  const totalScans = realCount + fakeCount + suspiciousCount;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold accent-green mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your deepfake and voice clone detection activity</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-[#00ff00]/30 bg-card hover:border-[#00ff00]/60 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Scans</p>
              <p className="text-3xl font-bold accent-green mt-2">{totalScans}</p>
            </div>
            <BarChart3 className="w-8 h-8 accent-green opacity-50" />
          </div>
        </Card>

        <Card className="p-6 border-[#00ffff]/30 bg-card hover:border-[#00ffff]/60 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Real Content</p>
              <p className="text-3xl font-bold accent-cyan mt-2">{realCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 accent-cyan opacity-50" />
          </div>
        </Card>

        <Card className="p-6 border-yellow-400/30 bg-card hover:border-yellow-400/60 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Suspicious</p>
              <p className="text-3xl font-bold text-yellow-400 mt-2">{suspiciousCount}</p>
            </div>
            <HelpCircle className="w-8 h-8 text-yellow-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 border-red-400/30 bg-card hover:border-red-400/60 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Deepfakes Detected</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{fakeCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 border-[#00ff00]/30 bg-card/50 hover:bg-card transition-colors cursor-pointer">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-lg bg-[#00ff00]/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 accent-green" />
            </div>
            <h3 className="text-xl font-bold mb-2 accent-green">Scan Media</h3>
            <p className="text-muted-foreground mb-6">
              Upload or paste a URL to analyze audio or video content for deepfakes
            </p>
            <Button
              onClick={() => setLocation("/dashboard/live-scan")}
              className="bg-[#00ff00] text-black font-bold hover:shadow-[0_0_20px_#00ff00]"
            >
              Start Scan
            </Button>
          </div>
        </Card>

        <Card className="p-8 border-[#00ffff]/30 bg-card/50 hover:bg-card transition-colors cursor-pointer">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-lg bg-[#00ffff]/20 flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 accent-cyan" />
            </div>
            <h3 className="text-xl font-bold mb-2 accent-cyan">View Analytics</h3>
            <p className="text-muted-foreground mb-6">
              Explore detailed charts and trends from your scan history
            </p>
            <Button
              onClick={() => setLocation("/dashboard/analytics")}
              variant="outline"
              className="border-[#00ffff] text-[#00ffff] font-bold hover:bg-[#00ffff]/10"
            >
              View Analytics
            </Button>
          </div>
        </Card>
      </div>

      {/* Demo Mode */}
      <Card className="p-8 border-[#00ff00]/30 bg-card/30">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 accent-green">Try Demo Mode</h3>
            <p className="text-muted-foreground max-w-2xl">
              Explore PhishShield AI with pre-loaded sample scans. See how the system detects deepfakes and voice clones without uploading any files.
            </p>
          </div>
          <Button
            onClick={() => setLocation("/dashboard/alert-history?demo=true")}
            className="bg-[#00ff00] text-black font-bold hover:shadow-[0_0_20px_#00ff00] whitespace-nowrap"
          >
            View Demo
          </Button>
        </div>
      </Card>
    </div>
  );
}
