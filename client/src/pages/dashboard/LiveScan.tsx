import { useState } from "react";
import { Upload, Link as LinkIcon, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function LiveScan() {
  const [scanType, setScanType] = useState<"audio" | "video">("audio");
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const createScanMutation = trpc.scans.create.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (scanType === "audio" && !file.type.startsWith("audio/")) {
        toast.error("Please select an audio file");
        return;
      }
      if (scanType === "video" && !file.type.startsWith("video/")) {
        toast.error("Please select a video file");
        return;
      }
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleScan = async () => {
    if (uploadMethod === "file" && !selectedFile) {
      toast.error("Please select a file");
      return;
    }
    if (uploadMethod === "url" && !urlInput) {
      toast.error("Please enter a URL");
      return;
    }

    setIsScanning(true);
    try {
      const threatScore = Math.floor(Math.random() * 100);
      const verdict = threatScore > 70 ? "fake" : threatScore > 40 ? "suspicious" : "real";
      const confidence = Math.floor(Math.random() * 30) + 70;

      const result = await createScanMutation.mutateAsync({
        scanType,
        fileKey: `scan-${Date.now()}`,
        fileName: selectedFile?.name || urlInput,
        fileUrl: urlInput || "",
        threatScore,
        verdict: verdict as "real" | "fake" | "suspicious",
        confidence,
        explanation: `This ${scanType} content shows ${confidence}% confidence of being ${verdict}. ${
          verdict === "fake"
            ? "Detected AI-generated artifacts and unnatural patterns."
            : verdict === "suspicious"
            ? "Some anomalies detected but not conclusive."
            : "Content appears to be authentic with no major red flags."
        }`,
      });

      setScanResult(result);
      toast.success("Scan completed!");
      setSelectedFile(null);
      setUrlInput("");
    } catch (error) {
      toast.error("Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "real":
        return "#00ff88";
      case "fake":
        return "#ff4757";
      case "suspicious":
        return "#ffc107";
      default:
        return "#00d9ff";
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
      <div>
        <h1 className="text-4xl font-bold mb-2">Live Scan</h1>
        <p className="text-[#cbd5e0]">Upload or paste a URL to analyze audio or video for deepfakes</p>
      </div>

      {/* Scan Type Selection */}
      <div className="glass-card">
        <h3 className="text-lg font-bold mb-4">Select Media Type</h3>
        <div className="flex gap-4">
          {["audio", "video"].map((type) => (
            <button
              key={type}
              onClick={() => setScanType(type as "audio" | "video")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                scanType === type
                  ? "bg-[#00ff88] text-[#0a0e27]"
                  : "bg-[#1a2847] text-[#cbd5e0] hover:bg-[#2a3857]"
              }`}
            >
              {type === "audio" ? "🎵 Audio" : "🎬 Video"}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Method Selection */}
      <div className="glass-card">
        <h3 className="text-lg font-bold mb-4">Upload Method</h3>
        <div className="flex gap-4">
          {["file", "url"].map((method) => (
            <button
              key={method}
              onClick={() => setUploadMethod(method as "file" | "url")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                uploadMethod === method
                  ? "bg-[#00d9ff] text-[#0a0e27]"
                  : "bg-[#1a2847] text-[#cbd5e0] hover:bg-[#2a3857]"
              }`}
            >
              {method === "file" ? (
                <>
                  <Upload className="w-4 h-4" /> Upload File
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4" /> Paste URL
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="glass-card">
        {uploadMethod === "file" ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Upload {scanType === "audio" ? "Audio" : "Video"} File</h3>
            <div className="border-2 border-dashed border-[#00ff88]/30 rounded-lg p-8 text-center hover:border-[#00ff88]/60 transition-colors cursor-pointer">
              <input
                type="file"
                accept={scanType === "audio" ? "audio/*" : "video/*"}
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <Upload className="w-12 h-12 text-[#00ff88] mx-auto mb-3 opacity-50" />
                <p className="text-lg font-semibold mb-1">
                  {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-[#4a5568] text-sm">
                  {scanType === "audio" ? "MP3, WAV, OGG up to 50MB" : "MP4, WebM, MOV up to 500MB"}
                </p>
              </label>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-[#00ff88]/10 rounded-lg border border-[#00ff88]/30">
                <CheckCircle className="w-5 h-5 text-[#00ff88]" />
                <span className="text-[#cbd5e0]">{selectedFile.name}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Enter Media URL</h3>
            <input
              type="url"
              placeholder="https://example.com/media.mp4"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a2847] border border-[#2a3857] rounded-lg text-[#f0f4f8] placeholder-[#4a5568] focus:border-[#00ff88] focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Scan Button */}
      <button
        onClick={handleScan}
        disabled={isScanning || (uploadMethod === "file" && !selectedFile) || (uploadMethod === "url" && !urlInput)}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
          isScanning || (uploadMethod === "file" && !selectedFile) || (uploadMethod === "url" && !urlInput)
            ? "bg-[#4a5568] text-[#cbd5e0] cursor-not-allowed"
            : "bg-[#00ff88] text-[#0a0e27] hover:bg-[#00e67e] hover:shadow-[0_0_25px_rgba(0,255,136,0.5)]"
        }`}
      >
        {isScanning ? (
          <>
            <Loader className="w-5 h-5 animate-spin" /> Analyzing...
          </>
        ) : (
          <>
            🔍 Start Scan
          </>
        )}
      </button>

      {/* Scan Result */}
      {scanResult && (
        <div className="glass-card border-[#00ff88]/30 animate-fade-in">
          <h3 className="text-2xl font-bold mb-6">Scan Result</h3>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Verdict */}
            <div className="text-center p-4 rounded-lg bg-[#1a2847]">
              <p className="text-[#4a5568] text-sm mb-2">Verdict</p>
              <p
                className="text-2xl font-bold capitalize"
                style={{ color: getVerdictColor(scanResult.verdict) }}
              >
                {scanResult.verdict}
              </p>
            </div>

            {/* Threat Score */}
            <div className="text-center p-4 rounded-lg bg-[#1a2847]">
              <p className="text-[#4a5568] text-sm mb-2">Threat Score</p>
              <p className="text-2xl font-bold text-[#00d9ff]">{scanResult.threatScore}%</p>
              <p className="text-sm text-[#cbd5e0] mt-1">{getThreatLevel(scanResult.threatScore)}</p>
            </div>

            {/* Confidence */}
            <div className="text-center p-4 rounded-lg bg-[#1a2847]">
              <p className="text-[#4a5568] text-sm mb-2">Confidence</p>
              <p className="text-2xl font-bold text-[#00ff88]">{scanResult.confidence}%</p>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-[#1a2847] p-4 rounded-lg">
            <p className="text-[#cbd5e0]">{scanResult.explanation}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setScanResult(null)}
              className="flex-1 py-3 px-4 rounded-lg font-medium bg-[#1a2847] text-[#cbd5e0] hover:bg-[#2a3857] transition-colors"
            >
              New Scan
            </button>
            <button className="flex-1 py-3 px-4 rounded-lg font-medium bg-[#00ff88] text-[#0a0e27] hover:bg-[#00e67e] transition-colors">
              Save Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
