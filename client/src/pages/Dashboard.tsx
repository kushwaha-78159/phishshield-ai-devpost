import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { useEffect } from "react";
import Overview from "./dashboard/Overview";
import LiveScan from "./dashboard/LiveScan";
import AlertHistory from "./dashboard/AlertHistory";
import Analytics from "./dashboard/Analytics";

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff00]"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Determine which page to show based on URL
  const page = location.split("/")[2] || "overview";

  const renderPage = () => {
    switch (page) {
      case "live-scan":
        return <LiveScan />;
      case "alert-history":
        return <AlertHistory />;
      case "analytics":
        return <Analytics />;
      default:
        return <Overview />;
    }
  };

  return (
    <DashboardLayout>
      {renderPage()}
    </DashboardLayout>
  );
}
