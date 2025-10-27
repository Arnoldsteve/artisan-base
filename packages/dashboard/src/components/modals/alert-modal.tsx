'use client';

import { useEffect, useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/components/ui/alert-dialog';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  description?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // This prevents hydration errors with server-side rendering
  if (!isMounted) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={loading}>
            Cancel
          </AlertDialogCancel>
          {/* Using `asChild` allows us to use our custom Button component */}
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Continue'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};