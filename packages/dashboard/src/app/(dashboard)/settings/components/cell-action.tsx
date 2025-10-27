'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';

import { Button } from '@repo/ui/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@repo/ui/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modals/alert-modal';
import { DashboardUserData } from '@/types/users';

interface CellActionProps {
  data: DashboardUserData;
  onUserDeleted: (userId: string) => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onUserDeleted }) => {
  const [open, setOpen] = useState(false);
  
  // This is now a simple synchronous function
  const onDeleteConfirm = () => {
    toast.success(`User "${data.email}" has been deleted.`);
    onUserDeleted(data.id); 
    setOpen(false);
  };
  
  const canPerformAction = data.role !== 'OWNER';

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDeleteConfirm}
        loading={false} // No loading state needed for mock data
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => toast.info("Edit functionality coming soon.")}>
            <Edit className="mr-2 h-4 w-4" /> Edit User
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {canPerformAction && (
             <DropdownMenuItem onClick={() => setOpen(true)} className="text-red-600 focus:text-red-600">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};