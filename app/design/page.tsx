"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Download, Share2, RefreshCcw, Wand2, Building2, Trees, PenTool, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArchitectDesignerPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const samplePrompts = [
    "Modern glass villa with infinity pool, twilight lighting, architectural photography",
    "Sustainable bamboo residential building with vertical gardens, morning sunlight",
    "Futuristic concrete museum, brutalist architecture, parametric design, 8k resolution",
    "Luxury apartment complex in Mumbai, art deco style, gold accents, night view"
  ];

  const handleGenerate = async (presetTarget?: string) => {
    const targetPrompt = presetTarget || prompt;
    if (!targetPrompt.trim()) return;

    setIsGenerating(true);
    setImgLoaded(false);
    setError(null);
    
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: targetPrompt }),
      });
      
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        setHistory(prev => [data.url, ...prev].slice(0, 4));
      } else if (data.error) {
        setError(data.error);
        setIsGenerating(false);
      }
        
        // Timeout if no response from image server
        setTimeout(() => {
          const img = document.querySelector(`img[src="${data.url}"]`) as HTMLImageElement;
          if (!img?.complete) {
            setIsGenerating(curr => {
                if (curr) setError("Image generation is taking longer than expected. Please try again.");
                return false;
            });
          }
        }, 20000); 
    } catch (err) {
      setError("Failed to connect to the design server.");
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-in fade-in duration-700">
        <header className="space-y-1">
          <h2 className="text-2xl font-heading font-extrabold text-[#182232] tracking-tight flex items-center gap-2">
            AI Architect <Sparkles className="w-5 h-5 text-[#feda5a] fill-[#feda5a]" />
          </h2>
          <p className="text-xs text-gray-400 font-sans font-medium uppercase tracking-widest">Visual Design Studio</p>
        </header>

        {/* Prompt Input */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#182232]/40 tracking-wider flex items-center gap-2">
                <PenTool size={12} /> Describe your vision
              </label>
              <textarea 
                className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/5 min-h-[100px] transition-all resize-none shadow-inner"
                placeholder="e.g. A modern 10-story office building with a curved glass facade and rooftop forest..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="flex-1 h-12 bg-gradient-to-r from-[#182232] to-[#425a81] hover:scale-[1.02] active:scale-95 transition-all rounded-xl font-heading font-bold shadow-lg shadow-[#182232]/10 flex gap-2"
              >
                {isGenerating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {isGenerating ? "Simulating Design..." : "Generate Architecture"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Area */}
        <AnimatePresence mode="wait">
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-square bg-gray-100">
                <img 
                  src={imageUrl} 
                  alt="AI Generated Architecture" 
                  onLoad={() => {
                    setIsGenerating(false);
                    setImgLoaded(true);
                    setError(null);
                  }}
                  onError={() => {
                    setIsGenerating(false);
                    setError("Could not load image. The AI server might be busy.");
                  }}
                  className={`w-full h-full object-cover transition-all duration-1000 ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                />
                
                {/* Image Overlay Actions */}
                {imgLoaded && !isGenerating && !error && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => window.open(imageUrl, '_blank')}
                      className="p-3 bg-white rounded-full hover:scale-110 transition-transform shadow-xl"
                    >
                      <Download className="w-5 h-5 text-[#182232]" />
                    </button>
                    <button className="p-3 bg-white rounded-full hover:scale-110 transition-transform shadow-xl">
                      <Share2 className="w-5 h-5 text-[#182232]" />
                    </button>
                  </div>
                )}

                {isGenerating && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm">
                      <div className="w-12 h-12 border-4 border-[#182232]/20 border-t-[#feda5a] rounded-full animate-spin" />
                      <p className="text-[10px] font-bold text-[#182232] uppercase tracking-[0.3em]">Processing Renders</p>
                   </div>
                )}

                {error && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-3 bg-red-50/90 backdrop-blur-sm">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                      <p className="text-xs font-bold text-red-700">{error}</p>
                      <Button variant="outline" size="sm" onClick={() => handleGenerate()} className="mt-2 text-[10px] h-8">Retry Design</Button>
                   </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Presets */}
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Design Inspirations</h3>
          <div className="grid grid-cols-2 gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => { setPrompt(p); handleGenerate(p); }}
                className="p-3 text-left bg-white border border-gray-50 rounded-xl hover:border-[#182232]/20 hover:bg-gray-50 transition-all group overflow-hidden"
              >
                <p className="text-[10px] font-medium text-gray-500 line-clamp-2 leading-relaxed group-hover:text-[#182232]">
                  {p}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-[#182232]/40 uppercase">
                  Try this <Sparkles size={8} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-5 bg-gradient-to-br from-[#feda5a]/10 to-[#ff9d00]/5 rounded-3xl border border-[#feda5a]/20 flex gap-4 items-center">
            <div className="w-10 h-10 rounded-2xl bg-[#feda5a] flex items-center justify-center shrink-0 shadow-lg shadow-[#feda5a]/20">
              <Building2 className="text-[#182232] w-5 h-5" />
            </div>
            <div className="space-y-0.5">
               <h4 className="text-xs font-bold text-[#182232]">Powered by Flux Intelligence</h4>
               <p className="text-[10px] text-gray-400 leading-tight">High-fidelity architectural visualization for site planning.</p>
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
