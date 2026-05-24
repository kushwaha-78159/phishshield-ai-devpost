import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function AlertHistory() {
  const [location] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [showDemo, setShowDemo] = useState(location.includes("demo=true"));

  const { data: scansData } = trpc.scans.list.useQuery({
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const { data: demoData } = trpc.scans.demoList.useQuery();

  const scans = scansData?.scans || [];
  const totalCount = scansData?.totalCount || 0;
  const demoScans = demoData?.scans || [];

  const displayScans = showDemo ? demoScans.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) : scans;
  const totalPages = showDemo ? Math.ceil(demoScans.length / ITEMS_PER_PAGE) : Math.ceil(totalCount / ITEMS_PER_PAGE);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "real":
        return { bg: "#00ff88", text: "#0a0e27" };
      case "fake":
        return { bg: "#ff4757", text: "#fff" };
      case "suspicious":
        return { bg: "#ffc107", text: "#0a0e27" };
      default:
        return { bg: "#4a5568", text: "#fff" };
    }
  };

  const getThreatLevel = (score: number) => {
    if (score > 80) return "Critical";
    if (score > 60) return "High";
    if (score > 40) return "Medium";
    return "Low";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Alert History</h1>
          <p className="text-[#cbd5e0]">View all scans and threat detections</p>
        </div>
        <button
          onClick={() => {
            setShowDemo(!showDemo);
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            showDemo
              ? "bg-[#00ff88] text-[#0a0e27]"
              : "bg-[#1a2847] text-[#cbd5e0] hover:bg-[#2a3857]"
          }`}
        >
          {showDemo ? "📋 Demo Mode" : "📊 Real Data"}
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a2847]">
              <th className="text-left py-4 px-4 text-[#4a5568] font-semibold">Type</th>
              <th className="text-left py-4 px-4 text-[#4a5568] font-semibold">File</th>
              <th className="text-left py-4 px-4 text-[#4a5568] font-semibold">Verdict</th>
              <th className="text-left py-4 px-4 text-[#4a5568] font-semibold">Threat Score</th>
              <th className="text-left py-4 px-4 text-[#4a5568] font-semibold">Confidence</th>
              <th className="text-left py-4 px-4 text-[#4a5568] font-semibold">Date</th>
              <th className="text-left py-4 px-4 text-[#4a5568] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayScans.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#4a5568]">
                  No scans found
                </td>
              </tr>
            ) : (
              displayScans.map((scan: any, idx: number) => {
                const verdictColor = getVerdictColor(scan.verdict);
                return (
                  <tr key={idx} className="border-b border-[#1a2847] hover:bg-[#1a2847]/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-[#cbd5e0] capitalize">{scan.scanType === "audio" ? "🎵" : "🎬"} {scan.scanType}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[#cbd5e0] truncate max-w-xs">{scan.fileName}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-bold capitalize inline-block"
                        style={{ backgroundColor: verdictColor.bg, color: verdictColor.text }}
                      >
                        {scan.verdict}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <span className="text-[#00d9ff] font-bold">{scan.threatScore}%</span>
                        <p className="text-[#4a5568] text-xs">{getThreatLevel(scan.threatScore)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[#00ff88] font-bold">{scan.confidence}%</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[#4a5568] text-sm">
                        {format(new Date(scan.createdAt), "MMM dd, HH:mm")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-[#2a3857] rounded-lg transition-colors text-[#00d9ff]" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-[#2a3857] rounded-lg transition-colors text-[#00ff88]" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[#4a5568]">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "bg-[#1a2847] text-[#4a5568] cursor-not-allowed"
                  : "bg-[#1a2847] text-[#00ff88] hover:bg-[#2a3857]"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-[#00ff88] text-[#0a0e27] font-bold"
                    : "bg-[#1a2847] text-[#cbd5e0] hover:bg-[#2a3857]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "bg-[#1a2847] text-[#4a5568] cursor-not-allowed"
                  : "bg-[#1a2847] text-[#00ff88] hover:bg-[#2a3857]"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
