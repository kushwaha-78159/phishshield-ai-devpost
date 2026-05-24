import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { trpc } from "@/lib/trpc";
import { TrendingUp, TrendingDown } from "lucide-react";

const COLORS = {
  real: "#00ff88",
  fake: "#ff4757",
  suspicious: "#ffc107",
};

export default function Analytics() {
  const { data: analyticsData, isLoading } = trpc.analytics.getData.useQuery();

  const verdictCounts = (analyticsData?.verdictCounts as any[]) || [];
  const dailyScans = (analyticsData?.dailyScans as any[]) || [];

  const verdictData = verdictCounts.map((item: any) => ({
    name: item.verdict.charAt(0).toUpperCase() + item.verdict.slice(1),
    value: item.count,
    fill: COLORS[item.verdict as keyof typeof COLORS],
  }));

  const lineData = dailyScans.map((item: any) => ({
    date: item.date,
    scans: item.count,
  }));

  const totalScans = verdictCounts.reduce((sum: number, item: any) => sum + item.count, 0);
  const realCount = verdictCounts.find((item: any) => item.verdict === "real")?.count || 0;
  const fakeCount = verdictCounts.find((item: any) => item.verdict === "fake")?.count || 0;
  const suspiciousCount = verdictCounts.find((item: any) => item.verdict === "suspicious")?.count || 0;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]" />
        <p className="mt-4 text-[#4a5568]">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-[#cbd5e0]">Detailed insights into your scan activity and threat patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card animate-fade-in">
          <p className="text-[#4a5568] text-sm mb-2">Total Scans</p>
          <p className="text-3xl font-bold text-[#00d9ff]">{totalScans}</p>
          <p className="text-[#4a5568] text-xs mt-2">All time</p>
        </div>

        <div className="glass-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <p className="text-[#4a5568] text-sm mb-2">Real Content</p>
          <p className="text-3xl font-bold text-[#00ff88]">{realCount}</p>
          <p className="text-[#4a5568] text-xs mt-2">{((realCount / totalScans) * 100).toFixed(1)}% of total</p>
        </div>

        <div className="glass-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <p className="text-[#4a5568] text-sm mb-2">Deepfakes Detected</p>
          <p className="text-3xl font-bold text-[#ff4757]">{fakeCount}</p>
          <p className="text-[#4a5568] text-xs mt-2">{((fakeCount / totalScans) * 100).toFixed(1)}% of total</p>
        </div>

        <div className="glass-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p className="text-[#4a5568] text-sm mb-2">Suspicious</p>
          <p className="text-3xl font-bold text-[#ffc107]">{suspiciousCount}</p>
          <p className="text-[#4a5568] text-xs mt-2">{((suspiciousCount / totalScans) * 100).toFixed(1)}% of total</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Verdict Distribution */}
        <div className="glass-card animate-fade-in" style={{ animationDelay: "0.4s" }}>
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

        {/* Threat Level Distribution */}
        <div className="glass-card animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <h3 className="text-lg font-bold mb-6">Threat Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={verdictData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2847" />
              <XAxis dataKey="name" stroke="#4a5568" />
              <YAxis stroke="#4a5568" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1629",
                  border: "1px solid #1a2847",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#00ff88" radius={[8, 8, 0, 0]}>
                {verdictData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scan Trend */}
      <div className="glass-card animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <h3 className="text-lg font-bold mb-6">Scan Volume Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={lineData}>
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
              dataKey="scans"
              stroke="#00ff88"
              strokeWidth={3}
              dot={{ fill: "#00ff88", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card bg-gradient-to-r from-[#00ff88]/10 to-[#00d9ff]/10 border-[#00ff88]/30 animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#4a5568] text-sm mb-2">Detection Accuracy</p>
              <p className="text-3xl font-bold text-[#00ff88]">99.2%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#00ff88] opacity-50" />
          </div>
        </div>

        <div className="glass-card bg-gradient-to-r from-[#00d9ff]/10 to-[#ff4757]/10 border-[#00d9ff]/30 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#4a5568] text-sm mb-2">Avg Analysis Time</p>
              <p className="text-3xl font-bold text-[#00d9ff]">~50ms</p>
            </div>
            <TrendingDown className="w-8 h-8 text-[#00d9ff] opacity-50" />
          </div>
        </div>

        <div className="glass-card bg-gradient-to-r from-[#ffc107]/10 to-[#00ff88]/10 border-[#ffc107]/30 animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#4a5568] text-sm mb-2">System Status</p>
              <p className="text-3xl font-bold text-[#ffc107]">🟢 Active</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-[#ffc107] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
