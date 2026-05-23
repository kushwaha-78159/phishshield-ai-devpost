import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Download, Eye } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function AlertHistory() {
  const [location] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [showDemo, setShowDemo] = useState(location.includes("demo=true"));

  const { data: scansData, isLoading } = trpc.scans.list.useQuery({
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const { data: demoData } = trpc.scans.demoList.useQuery();

  const scans = scansData?.scans || [];
  const totalCount = scansData?.totalCount || 0;
  const demoScans = demoData?.scans || [];

  const displayScans = showDemo ? demoScans : scans;
  const totalPages = showDemo ? Math.ceil(demoScans.length / ITEMS_PER_PAGE) : Math.ceil(totalCount / ITEMS_PER_PAGE);

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "real":
        return <Badge className="bg-green-900 text-green-200 hover:bg-green-800">✓ Real</Badge>;
      case "fake":
        return <Badge className="bg-red-900 text-red-200 hover:bg-red-800">✗ Fake</Badge>;
      case "suspicious":
        return <Badge className="bg-yellow-900 text-yellow-200 hover:bg-yellow-800">? Suspicious</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getThreatColor = (score: number) => {
    if (score > 70) return "text-red-400";
    if (score > 40) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold accent-green mb-2">Alert History</h1>
          <p className="text-muted-foreground">View all your scan results and detections</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setShowDemo(false);
              setCurrentPage(1);
            }}
            variant={!showDemo ? "default" : "outline"}
            className={!showDemo ? "bg-[#00ff00] text-black" : "border-[#00ffff] text-[#00ffff]"}
          >
            My Scans
          </Button>
          <Button
            onClick={() => {
              setShowDemo(true);
              setCurrentPage(1);
            }}
            variant={showDemo ? "default" : "outline"}
            className={showDemo ? "bg-[#00ff00] text-black" : "border-[#00ffff] text-[#00ffff]"}
          >
            Demo Mode
          </Button>
        </div>
      </div>

      {isLoading && !showDemo ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ff00]"></div>
          <p className="mt-4 text-muted-foreground">Loading scans...</p>
        </div>
      ) : displayScans.length === 0 ? (
        <Card className="p-12 border-[#00ff00]/30 bg-card text-center">
          <p className="text-muted-foreground mb-4">
            {showDemo ? "No demo scans available yet." : "No scans yet. Start by uploading media to analyze."}
          </p>
          {!showDemo && (
            <Button className="bg-[#00ff00] text-black font-bold hover:shadow-[0_0_20px_#00ff00]">Start Scanning</Button>
          )}
        </Card>
      ) : (
        <>
          <Card className="border-[#00ff00]/30 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-card/50 border-b border-border">
                  <TableRow>
                    <TableHead className="text-[#00ff00]">File Name</TableHead>
                    <TableHead className="text-[#00ff00]">Type</TableHead>
                    <TableHead className="text-[#00ff00]">Verdict</TableHead>
                    <TableHead className="text-[#00ff00]">Threat Score</TableHead>
                    <TableHead className="text-[#00ff00]">Confidence</TableHead>
                    <TableHead className="text-[#00ff00]">Date</TableHead>
                    <TableHead className="text-[#00ff00]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayScans.map((scan: any) => (
                    <TableRow key={scan.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                      <TableCell className="font-mono text-sm truncate max-w-xs">
                        {scan.fileName || scan.title}
                      </TableCell>
                      <TableCell className="uppercase font-bold text-xs">
                        {scan.scanType === "audio" ? "🎵 Audio" : "🎬 Video"}
                      </TableCell>
                      <TableCell>{getVerdictBadge(scan.verdict)}</TableCell>
                      <TableCell className={`font-bold ${getThreatColor(scan.threatScore)}`}>
                        {scan.threatScore}%
                      </TableCell>
                      <TableCell className="text-[#00ffff]">{scan.confidence}%</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(scan.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-[#00ff00]/20"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 accent-green" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-[#00ffff]/20"
                            title="Download report"
                          >
                            <Download className="w-4 h-4 accent-cyan" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={page === currentPage}
                        className={page === currentPage ? "bg-[#00ff00] text-black" : "cursor-pointer hover:bg-card"}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
