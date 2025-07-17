"use client";
import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/auth-context";

const avatarUrl =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";

export const Profile: React.FC = () => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  // Keep profileData in sync with user if user changes (e.g. after login)
  // This is a simple effect to update local state if user changes
  // (optional, but helps with SPA navigation)
  // useEffect(() => {
  //   setProfileData({
  //     firstName: user?.firstName || "",
  //     lastName: user?.lastName || "",
  //     email: user?.email || "",
  //   });
  // }, [user]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl} alt={profileData.firstName} />
            <AvatarFallback>
              {(profileData.firstName?.charAt(0) || "").toUpperCase()}
              {(profileData.lastName?.charAt(0) || "").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">
              {profileData.firstName} {profileData.lastName}
            </h3>
            <p className="text-muted-foreground">{profileData.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            First Name
          </label>
          <Input
            value={profileData.firstName}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Last Name
          </label>
          <Input
            value={profileData.lastName}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
            disabled={!isEditing}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <Input
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            disabled={!isEditing}
          />
        </div>

        {isEditing && (
          <div className="flex space-x-2">
            <Button onClick={handleSaveProfile}>Save Changes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
