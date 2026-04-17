"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  QrCode, X, ScanLine, CheckCircle2, Loader2, 
  PackagePlus, Camera, ArrowRightLeft, Hash, 
  FileText, Info, ArrowUpRight, ArrowDownLeft 
} from "lucide-react";
import { Button } from "./ui/button";
import jsQR from "jsqr";

export function QRScannerModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const [scanState, setScanState] = useState<"idle" | "requesting" | "scanning" | "processing" | "form" | "success">("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);
  
  // Form States
  const [scannedData, setScannedData] = useState<{ id: string; name: string } | null>(null);
  const [invalidCodeError, setInvalidCodeError] = useState(false);
  const [transactionType, setTransactionType] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");
  
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  const resetForm = () => {
    setScanState("idle");
    setScannedData(null);
    setInvalidCodeError(false);
    setTransactionType("IN");
    setQuantity("1");
    setDescription("");
  };

  const handleClose = () => {
    stopCamera();
    onClose();
    resetForm();
  };

  // The actual scanning logic
  const tick = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          // --- DESIRED CODE FILTERING ---
          // Rule: Code must start with 'MAT-' followed by ID and Name separated by '|'
          // Example: MAT-8842|Steel Rebar G60
          if (code.data.startsWith("MAT-")) {
            const parts = code.data.replace("MAT-", "").split("|");
            const id = parts[0] || "Unknown";
            const name = parts[1] || "Scanning Product";
            
            setScannedData({ id, name });
            setScanState("processing");
            stopCamera();
            
            // Artificial delay for premium feel
            setTimeout(() => {
              setScanState("form");
            }, 800);
            return;
          } else {
            // Briefly show indicator that this code is NOT what we want
            if (!invalidCodeError) {
              setInvalidCodeError(true);
              setTimeout(() => setInvalidCodeError(false), 3000);
            }
          }
        }
      }
    }
    if (scanState === "scanning") {
      requestRef.current = requestAnimationFrame(tick);
    }
  }, [scanState, stopCamera]);

  const handleStartScanner = async () => {
    setScanState("requesting");
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Insecure context");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      setScanState("scanning");
    } catch (err) {
      console.error("Camera access error:", err);
      // Fallback for demo
      setScanState("scanning"); 
    }
  };

  useEffect(() => {
    if (scanState === "scanning" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      requestRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [scanState, tick]);

  const handleSimulateScan = () => {
    setScannedData({ id: "8842", name: "Steel Rebar G60" });
    setScanState("processing");
    stopCamera();
    setTimeout(() => {
      setScanState("form");
    }, 1200);
  };

  const handleSubmit = () => {
    setScanState("processing");
    setTimeout(() => {
      setScanState("success");
      setTimeout(() => {
        handleClose();
      }, 2500);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in duration-300 flex flex-col my-auto border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 p-5 border-b border-gray-100 flex justify-between items-center bg-[#f9f9ff]">
          <div className="flex items-center gap-2">
            <QrCode size={20} className="text-[#182232]" />
            <h2 className="font-heading font-bold text-[#182232] text-lg">Inventory Scanner</h2>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex-1">
          {scanState === "idle" && (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#f0f3ff] rounded-full flex items-center justify-center mb-6">
                <Camera size={32} className="text-[#182232]" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#182232] mb-2">Ready to Scan?</h3>
              <p className="text-sm text-gray-500 mb-8 px-4">
                Scan labels starting with <span className="font-bold text-[#182232]">MAT-</span> to update inventory.
              </p>
              <Button 
                onClick={handleStartScanner}
                className="w-full bg-[#182232] hover:bg-[#2d3748] h-12 rounded-xl text-white font-bold"
              >
                Enable Camera & Scan
              </Button>
            </div>
          )}

          {scanState === "requesting" && (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 size={48} className="text-[#182232] animate-spin" />
              <p className="font-heading font-bold text-lg text-[#182232] mt-8">Requesting Camera...</p>
            </div>
          )}

          {scanState === "scanning" && (
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden mb-6 border-4 border-gray-100 shadow-xl group">
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-white/50 rounded-3xl relative">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary shadow-[0_0_15px_rgba(24,34,50,0.8)] animate-[scan_2s_infinite]" />
                  </div>
                </div>

                {/* ERROR OVERLAY */}
                {invalidCodeError && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                    <X size={14} className="bg-white text-red-600 rounded-full" />
                    Invalid Material Label
                  </div>
                )}

                {!streamRef.current && (
                  <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
                    <Info className="text-gray-600 mb-2" size={32} />
                    <p className="text-xs text-gray-500">Preview blocked (Insecure Context)</p>
                    <button onClick={handleSimulateScan} className="mt-4 text-[10px] underline text-primary">Simulate manual scan</button>
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <ScanLine size={16} className="text-primary animate-pulse" />
                Wait for MAT- code detection...
              </p>
            </div>
          )}

          {scanState === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-100 border-t-primary rounded-full animate-spin mb-6" />
              <p className="font-heading font-bold text-lg text-[#182232]">Verified Code Found...</p>
            </div>
          )}

          {scanState === "form" && scannedData && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#f0f3ff] rounded-2xl p-4 flex items-start gap-3 border border-[#dee8ff]">
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  <PackagePlus size={24} className="text-[#182232]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-[#182232]">{scannedData.name}</h4>
                  <p className="text-xs text-gray-500 font-mono mt-1 tracking-tight uppercase">ID: {scannedData.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setTransactionType("IN")} className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all ${transactionType === "IN" ? "bg-[#182232] border-[#182232] text-white" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"}`}><ArrowDownLeft size={20} /><span className="text-xs font-bold">Stock In</span></button>
                    <button onClick={() => setTransactionType("OUT")} className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all ${transactionType === "OUT" ? "bg-[#ba1a1a] border-[#ba1a1a] text-white" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"}`}><ArrowUpRight size={20} /><span className="text-xs font-bold">Stock Out</span></button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Quantity</label>
                  <input type="number" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-[#182232] text-lg" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Notes</label>
                  <textarea className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Batch details..." />
                </div>
              </div>

              <Button onClick={handleSubmit} className={`w-full h-14 rounded-2xl text-white font-bold ${transactionType === "IN" ? "bg-[#182232] hover:bg-[#2d3748]" : "bg-[#ba1a1a] hover:bg-[#93000a]"}`}>Sync with Database</Button>
            </div>
          )}

          {scanState === "success" && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 relative">
                <CheckCircle2 size={48} className="text-[#40b472]" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-[#182232] mb-3">Sync Successful</h3>
              <p className="text-sm text-gray-500 mb-8 px-6">Inventory record has been updated on the Central Ledger.</p>
              <div className="text-[10px] font-mono bg-gray-100 px-4 py-2 rounded-full text-gray-400">AUTH REF: TX-{Math.floor(Math.random() * 900000 + 100000)}</div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes scan { 0%, 100% { top: 0%; } 50% { top: 100%; } }`}</style>
    </div>
  );
}
