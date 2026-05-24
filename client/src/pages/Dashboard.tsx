import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Overview from "./dashboard/Overview";
import LiveScan from "./dashboard/LiveScan";
import AlertHistory from "./dashboard/AlertHistory";
import Analytics from "./dashboard/Analytics";

export default function Dashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const logoutMutation = trpc.auth.logout.useMutation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff88]" />
          <p className="mt-4 text-[#cbd5e0]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "scan", label: "Live Scan", icon: "🔍" },
    { id: "history", label: "Alert History", icon: "📋" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-40 backdrop-blur-md border-b border-[#1a2847] bg-[#0a0e27]/80">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#1a2847] rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Shield className="w-6 h-6 text-[#00ff88]" />
              <span className="text-[#00ff88]">PhishShield</span>
              <span className="text-[#00d9ff]">AI</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div className="text-[#00ff88] font-semibold">{user?.name || "User"}</div>
              <div className="text-[#4a5568] text-xs">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-[#1a2847] rounded-lg transition-colors text-[#cbd5e0]"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#0f1629] border-r border-[#1a2847] transition-all duration-300 z-30 ${
            sidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <div className="p-6 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium ${
                  activeTab === tab.id
                    ? "bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30"
                    : "text-[#cbd5e0] hover:bg-[#1a2847]"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <div className="p-8 max-w-7xl">
            {activeTab === "overview" && <Overview />}
            {activeTab === "scan" && <LiveScan />}
            {activeTab === "history" && <AlertHistory />}
            {activeTab === "analytics" && <Analytics />}
          </div>
        </main>
      </div>
    </div>
  );
}
