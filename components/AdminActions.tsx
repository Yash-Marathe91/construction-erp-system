"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Plus, MapPin } from "lucide-react";
import { NewProjectModal } from "./NewProjectModal";
import { NewSiteModal } from "./NewSiteModal";

export function AdminActions() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="default" 
          className="bg-[#182232] hover:bg-[#2d3748] h-auto py-3 flex flex-col gap-1 items-center justify-center"
          onClick={() => setIsProjectModalOpen(true)}
        >
          <Plus className="w-5 h-5 mb-1 text-white" />
          <span className="font-heading text-xs">New Project</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-3 flex flex-col gap-1 items-center justify-center bg-white border-2 border-[#d9e3f9] hover:bg-[#f0f3ff] text-[#182232]"
          onClick={() => setIsSiteModalOpen(true)}
        >
          <MapPin className="w-5 h-5 mb-1 text-[#182232]" />
          <span className="font-heading text-xs">Add Site</span>
        </Button>
      </div>
      <NewProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
      <NewSiteModal isOpen={isSiteModalOpen} onClose={() => setIsSiteModalOpen(false)} />
    </>
  );
}
