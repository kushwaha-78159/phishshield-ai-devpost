import { Card } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { trpc } from "@/lib/trpc";

const COLORS = {
  real: "#00ff00",
  fake: "#ff0000",
  suspicious: "#ffff00",
};

export default function Analytics() {
  const { data: analyticsData, isLoading } = trpc.analytics.getData.useQuery();

  const verdictCounts = (analyticsData?.verdictCounts as any[]) || [];
  const dailyScans = (analyticsData?.dailyScans as any[]) || [];

  const verdictData = verdictCounts.map((item: any) => ({
    name: item.verdict.charAt(0).toUpperCase() + item.verdict.slice(1),
    value: item.count,
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
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff00]"></div>
        <p className="mt-4 text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold accent-green mb-2">Analytics</h1>
        <p className="text-muted-foreground">Detailed insights into your scan activity and threat patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-[#00ff00]/30 bg-card">
          <p className="text-muted-foreground text-sm mb-2">Total Scans</p>
          <p className="text-3xl font-bold accent-green">{totalScans}</p>
        </Card>
        <Card className="p-6 border-green-400/30 bg-card">
          <p className="text-muted-foreground text-sm mb-2">Authentic</p>
          <p className="text-3xl font-bold text-green-400">{realCount}</p>
        </Card>
        <Card className="p-6 border-yellow-400/30 bg-card">
          <p className="text-muted-foreground text-sm mb-2">Suspicious</p>
          <p className="text-3xl font-bold text-yellow-400">{suspiciousCount}</p>
        </Card>
        <Card className="p-6 border-red-400/30 bg-card">
          <p className="text-muted-foreground text-sm mb-2">Deepfakes</p>
          <p className="text-3xl font-bold text-red-400">{fakeCount}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-[#00ff00]/30 bg-card">
          <h3 className="text-lg font-bold accent-green mb-6">Verdict Distribution</h3>
          {verdictData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={verdictData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill={COLORS.real} />
                  <Cell fill={COLORS.fake} />
                  <Cell fill={COLORS.suspicious} />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d0d0d",
                    border: "1px solid #00ff00",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </Card>

        <Card className="p-6 border-[#00ffff]/30 bg-card">
          <h3 className="text-lg font-bold accent-cyan mb-6">Scan Volume (Last 30 Days)</h3>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" style={{ fontSize: "12px" }} />
                <YAxis stroke="#888" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d0d0d",
                    border: "1px solid #00ffff",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="scans" fill="#00ffff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6 border-[#00ff00]/30 bg-card">
        <h3 className="text-lg font-bold accent-green mb-6">Threat Trend</h3>
        {lineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" style={{ fontSize: "12px" }} />
              <YAxis stroke="#888" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d0d0d",
                  border: "1px solid #00ff00",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="scans" stroke="#00ff00" strokeWidth={2} dot={{ fill: "#00ff00" }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </Card>
    </div>
  );
}
