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

type ActionVariant = 'default' | 'destructive' | 'warning' | 'primary';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;

  title: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  variant?: ActionVariant;
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title,
  description = 'This action cannot be undone.',
  actionLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  // choose button variant styling
  const getButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'warning':
        return 'outline'; // or a custom color
      case 'primary':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={onClose}>
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              variant={getButtonVariant()}
              disabled={loading}
              onClick={onConfirm}
            >
              {loading ? `${actionLabel}...` : actionLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
