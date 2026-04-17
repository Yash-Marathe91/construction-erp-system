"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { UserPlus } from "lucide-react";
import { InviteUserModal } from "./InviteUserModal";

export function UserActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-[#715c00] border-none text-white h-9 px-3"
        onClick={() => setIsModalOpen(true)}
      >
        <UserPlus className="w-4 h-4 mr-2" /> Invite Staff
      </Button>
      <InviteUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
