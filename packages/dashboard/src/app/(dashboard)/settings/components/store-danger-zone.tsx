"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { AlertModal } from "@/components/modals/alert-modal";

interface StoreDangerZoneProps {
  storeName: string;
}

export function StoreDangerZone({ storeName }: StoreDangerZoneProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const onConfirmDelete = async () => {
    setIsDeleting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(`Store "${storeName}" has been permanently deleted.`);
    // In a real app, you would redirect the user away from the dashboard here.
    setIsAlertOpen(false);
    setIsDeleting(false);
  };

  return (
    <>
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
        title={`Delete "${storeName}"?`}
        description="This is a permanent action. All data associated with this store, including products, orders, and customers, will be lost forever."
      />
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Be careful, these actions are irreversible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="confirm-store-name" className="font-semibold">
              Delete this store
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Once you delete a store, there is no going back. Please be
              certain.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              id="confirm-store-name"
              placeholder={`Type "${storeName}" to confirm`}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <Button
              variant="destructive"
              disabled={confirmText !== storeName}
              onClick={() => setIsAlertOpen(true)}
            >
              Delete Store
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
