"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paintbrush, Loader2, X, Image as ImageIcon } from "lucide-react";

export default function AIArchitectureDesigner() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      // The single image that will be displayed every time
      setGeneratedImage("https://image2url.com/r2/default/images/1775632975667-0d85da7c-954f-4caa-84f4-e1efe2ed637d.jpg");
      setIsGenerating(false);
    }, 2000);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setPrompt("");
    setGeneratedImage(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#182232] text-white rounded-xl p-4 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-2 hover:bg-[#2d3748] transition-colors w-full mt-4"
      >
        <Paintbrush className="text-white" />
        <span className="font-heading font-semibold text-sm">AI Architecture Designer</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#f9f9ff]">
              <div className="flex items-center gap-2">
                <Paintbrush size={18} className="text-[#182232]" />
                <h2 className="font-heading font-bold text-[#182232]">AI Architecture Designer</h2>
              </div>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm border-gray-200 font-semibold text-gray-700">Design Prompt</label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#182232]/50 resize-none bg-[#f9f9ff]"
                  rows={3}
                  placeholder="E.g., Modern concrete building with large glass windows and vertical gardens..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-[#182232] hover:bg-[#2d3748] text-white py-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Design...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-5 w-5" /> Generate from Prompt
                  </>
                )}
              </Button>

              {generatedImage && (
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 relative group animate-in fade-in duration-500">
                  <div className="absolute top-2 left-2 bg-white/90 text-xs font-bold px-2 py-1 rounded backdrop-blur text-[#182232]">
                    Generated Result
                  </div>
                  <img src={generatedImage} alt="Generated architecture" className="w-full h-auto object-cover max-h-[300px]" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
