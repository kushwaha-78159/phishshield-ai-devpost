import { trpc } from "@/lib/trpc";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Shield, AlertTriangle, CheckCircle, Clock, Zap, BarChart } from "lucide-react";

export default function Overview() {
  const { data: analytics } = trpc.analytics.getData.useQuery();

  const verdictCounts = (analytics?.verdictCounts as any[]) || [];
  const realCount = verdictCounts.find((v: any) => v.verdict === "real")?.count || 0;
  const fakeCount = verdictCounts.find((v: any) => v.verdict === "fake")?.count || 0;
  const suspiciousCount = verdictCounts.find((v: any) => v.verdict === "suspicious")?.count || 0;
  const totalScans = realCount + fakeCount + suspiciousCount;

  const stats = [
    {
      label: "Total Scans",
      value: totalScans,
      icon: Shield,
      color: "#00ff88",
    },
    {
      label: "Real Content",
      value: realCount,
      icon: CheckCircle,
      color: "#00ff88",
    },
    {
      label: "Deepfakes",
      value: fakeCount,
      icon: AlertTriangle,
      color: "#ff4757",
    },
    {
      label: "Suspicious",
      value: suspiciousCount,
      icon: Clock,
      color: "#ffc107",
    },
  ];

  const verdictData = [
    { name: "Real", value: realCount, fill: "#00ff88" },
    { name: "Fake", value: fakeCount, fill: "#ff4757" },
    { name: "Suspicious", value: suspiciousCount, fill: "#ffc107" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-[#cbd5e0]">Real-time threat detection and analysis</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="glass-card group hover:border-[#00ff88] animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[#4a5568] text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
                <Icon className="w-8 h-8" style={{ color: stat.color, opacity: 0.5 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Verdict Distribution */}
        <div className="glass-card lg:col-span-1 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-lg font-bold mb-6">Verdict Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={verdictData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {verdictData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0f1629", border: "1px solid #1a2847" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {verdictData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-[#cbd5e0]">{item.name}</span>
                </div>
                <span className="font-bold" style={{ color: item.fill }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scan Trend */}
        <div className="glass-card lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-lg font-bold mb-6">Scan Volume Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.dailyScans || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2847" />
              <XAxis dataKey="date" stroke="#4a5568" />
              <YAxis stroke="#4a5568" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1629",
                  border: "1px solid #1a2847",
                  borderRadius: "8px",
                }}
                cursor={{ stroke: "#00ff88", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#00ff88"
                strokeWidth={3}
                dot={{ fill: "#00ff88", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card group hover:border-[#00ff88] cursor-pointer animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-[#00ff88]" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Start New Scan</h3>
              <p className="text-[#cbd5e0] text-sm">Upload or paste a URL to analyze media for deepfakes</p>
            </div>
          </div>
        </div>

        <div className="glass-card group hover:border-[#00d9ff] cursor-pointer animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#00d9ff]/20 flex items-center justify-center flex-shrink-0">
              <BarChart className="w-6 h-6 text-[#00d9ff]" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">View Full Analytics</h3>
              <p className="text-[#cbd5e0] text-sm">Explore detailed charts and trends from your history</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="glass-card bg-gradient-to-r from-[#00ff88]/10 to-[#00d9ff]/10 border-[#00ff88]/30 animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">System Status</h3>
            <p className="text-[#cbd5e0]">All systems operational • Detection accuracy: 99.2% • Avg response time: 50ms</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-[#00ff88] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
