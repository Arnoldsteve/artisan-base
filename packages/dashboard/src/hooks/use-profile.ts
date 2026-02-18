"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { useAuthContext } from "@/contexts/auth-context";

/**
 * SOLID Principle: Single Responsibility
 * This hook manages the Global User Identity profile.
 * Note: Profile updates affect the User globally across all their stores.
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: (data: { firstName: string; lastName: string }) =>
      authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // 1. Invalidate global profile queries to trigger a fresh fetch
      queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
      
      // 2. Immediate Feedback
      toast.success("Profile updated successfully");
      
      /**
       * Scale Tip: In a million-user system, we use 'router.refresh()' 
       * or update the AuthContext state here to ensure the Sidebar 
       * reflects the new name without a page reload.
       */
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
};