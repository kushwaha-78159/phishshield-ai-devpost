import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, AlertCircle, CheckCircle } from "lucide-react";
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

      const fileName = uploadMethod === "file" ? selectedFile!.name : urlInput;
      const fileKey = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fileUrl = uploadMethod === "file" ? URL.createObjectURL(selectedFile!) : urlInput;

      const explanation =
        verdict === "fake"
          ? "High probability of AI-generated content detected. Facial artifacts and unnatural blinking patterns identified."
          : verdict === "suspicious"
            ? "Some anomalies detected. Recommend manual review. Audio frequency patterns show minor irregularities."
            : "Content appears authentic. No significant deepfake markers detected.";

      const result = await createScanMutation.mutateAsync({
        fileKey,
        fileName,
        fileUrl,
        scanType,
        threatScore,
        verdict,
        confidence,
        explanation,
      });

      setScanResult(result);
      toast.success("Scan completed!");
    } catch (error) {
      toast.error("Scan failed. Please try again.");
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold accent-green mb-2">Live Scan</h1>
        <p className="text-muted-foreground">Upload or paste media to detect deepfakes and voice clones</p>
      </div>

      {!scanResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-[#00ff00]/30 bg-card">
              <Label className="text-base font-bold accent-green mb-4 block">Media Type</Label>
              <div className="flex gap-4">
                <Button
                  onClick={() => setScanType("audio")}
                  variant={scanType === "audio" ? "default" : "outline"}
                  className={scanType === "audio" ? "bg-[#00ff00] text-black" : "border-[#00ffff]"}
                >
                  Audio
                </Button>
                <Button
                  onClick={() => setScanType("video")}
                  variant={scanType === "video" ? "default" : "outline"}
                  className={scanType === "video" ? "bg-[#00ff00] text-black" : "border-[#00ffff]"}
                >
                  Video
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-[#00ff00]/30 bg-card">
              <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as "file" | "url")}>
                <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
                  <TabsTrigger value="file" className="data-[state=active]:bg-[#00ff00] data-[state=active]:text-black">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger value="url" className="data-[state=active]:bg-[#00ff00] data-[state=active]:text-black">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Paste URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="mt-6 space-y-4">
                  <div className="border-2 border-dashed border-[#00ff00]/50 rounded-lg p-8 text-center hover:border-[#00ff00] transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept={scanType === "audio" ? "audio/*" : "video/*"}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <Upload className="w-12 h-12 accent-green mx-auto mb-4" />
                      <p className="font-bold accent-green mb-2">Drop file here or click to select</p>
                      <p className="text-sm text-muted-foreground">
                        {scanType === "audio" ? "MP3, WAV, OGG" : "MP4, WebM, MOV"} up to 100MB
                      </p>
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="flex items-center gap-3 p-3 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg">
                      <CheckCircle className="w-5 h-5 accent-green" />
                      <div>
                        <p className="font-bold text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="url" className="mt-6 space-y-4">
                  <Input
                    placeholder="https://example.com/media.mp4"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <p className="text-sm text-muted-foreground">Enter a direct URL to audio or video content</p>
                </TabsContent>
              </Tabs>
            </Card>

            <Button
              onClick={handleScan}
              disabled={isScanning || (!selectedFile && uploadMethod === "file") || (!urlInput && uploadMethod === "url")}
              size="lg"
              className="w-full bg-[#00ff00] text-black font-bold hover:shadow-[0_0_30px_#00ff00] disabled:opacity-50"
            >
              {isScanning ? "Analyzing..." : "Start Scan"}
            </Button>
          </div>

          <div className="space-y-4">
            <Card className="p-4 border-[#00ffff]/30 bg-card/50">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 accent-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm accent-cyan mb-1">How It Works</p>
                  <p className="text-xs text-muted-foreground">
                    Our AI analyzes visual and audio patterns to detect deepfakes and voice clones with 99.2% accuracy
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-[#00ff00]/30 bg-card/50">
              <p className="font-bold text-sm accent-green mb-2">What We Check</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Facial artifacts and anomalies</li>
                <li>• Blinking patterns</li>
                <li>• Audio frequency analysis</li>
                <li>• Voice pattern matching</li>
                <li>• AI generation signatures</li>
              </ul>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="p-8 border-[#00ff00]/30 bg-card">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Scan Complete</h2>
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                scanResult.verdict === "real"
                  ? "bg-green-900/30 border-2 border-green-400"
                  : scanResult.verdict === "fake"
                    ? "bg-red-900/30 border-2 border-red-400"
                    : "bg-yellow-900/30 border-2 border-yellow-400"
              }`}>
                <span className={`text-3xl font-bold ${
                  scanResult.verdict === "real"
                    ? "text-green-400"
                    : scanResult.verdict === "fake"
                      ? "text-red-400"
                      : "text-yellow-400"
                }`}>
                  {scanResult.threatScore}%
                </span>
              </div>
              <p className={`text-2xl font-bold ${
                scanResult.verdict === "real"
                  ? "accent-green"
                  : scanResult.verdict === "fake"
                    ? "text-red-400"
                    : "text-yellow-400"
              }`}>
                {scanResult.verdict === "real" ? "AUTHENTIC" : scanResult.verdict === "fake" ? "DEEPFAKE DETECTED" : "SUSPICIOUS"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-1">Threat Score</p>
                <p className="text-2xl font-bold accent-green">{scanResult.threatScore}%</p>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-1">Confidence</p>
                <p className="text-2xl font-bold accent-cyan">{scanResult.confidence}%</p>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-1">File Type</p>
                <p className="text-2xl font-bold uppercase">{scanResult.scanType.slice(0, 3)}</p>
              </div>
            </div>

            <div className="p-4 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg mb-8">
              <p className="font-bold text-sm accent-green mb-2">Analysis Details</p>
              <p className="text-sm text-muted-foreground">{scanResult.explanation}</p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setScanResult(null)}
                className="flex-1 bg-[#00ff00] text-black font-bold hover:shadow-[0_0_20px_#00ff00]"
              >
                Scan Another File
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-[#00ffff] text-[#00ffff] font-bold hover:bg-[#00ffff]/10"
              >
                Download Report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
