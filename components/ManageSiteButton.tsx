"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { ManageSiteModal } from "./ManageSiteModal";

interface ManageSiteButtonProps {
  site: { name: string; location: string };
}

export function ManageSiteButton({ site }: ManageSiteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 gap-1 text-[#182232] p-0 pr-2 hover:bg-transparent"
        onClick={() => setIsModalOpen(true)}
      >
        Manage <ArrowRight className="w-3 h-3" />
      </Button>
      <ManageSiteModal site={site} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
