"use client";
import { useState, useEffect } from "react";
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
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import { 
  Edit3, 
  Save, 
  X, 
  User, 
  Mail, 
  Calendar,
  Shield,
  Camera,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/auth-context";

const avatarUrl =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";

export const Profile: React.FC = () => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  // Get wishlist count from localStorage
  useEffect(() => {
    const getWishlistCount = () => {
      try {
        const wishlist = localStorage.getItem('wishlist');
        if (wishlist) {
          const parsedWishlist = JSON.parse(wishlist);
          setWishlistCount(Array.isArray(parsedWishlist) ? parsedWishlist.length : 0);
        }
      } catch (error) {
        console.error('Error reading wishlist from localStorage:', error);
        setWishlistCount(0);
      }
    };

    getWishlistCount();

    // Listen for storage changes to update count in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wishlist') {
        getWishlistCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom wishlist events (if your app dispatches them)
    const handleWishlistUpdate = () => getWishlistCount();
    window.addEventListener('wishlist-updated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, []);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
    setIsLoading(false);
    toast.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setProfileData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  const isFormValid = profileData.firstName.trim() && profileData.lastName.trim() && profileData.email.trim();

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
        <CardContent className="relative pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                <AvatarImage src={avatarUrl} alt={`${profileData.firstName} ${profileData.lastName}`} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  {(profileData.firstName?.charAt(0) || "").toUpperCase()}
                  {(profileData.lastName?.charAt(0) || "").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {profileData.firstName} {profileData.lastName}
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {profileData.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Account
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant={isEditing ? "ghost" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="shrink-0"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                {isEditing ? "Update your personal details below" : "Your current profile information"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                First Name
                {isEditing && <span className="text-destructive">*</span>}
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
                placeholder="Enter your first name"
                className={isEditing ? "border-primary/50 focus:border-primary" : ""}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                Last Name
                {isEditing && <span className="text-destructive">*</span>}
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
                placeholder="Enter your last name"
                className={isEditing ? "border-primary/50 focus:border-primary" : ""}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
              {isEditing && <span className="text-destructive">*</span>}
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
              placeholder="Enter your email address"
              className={isEditing ? "border-primary/50 focus:border-primary" : ""}
            />
          </div>

          {isEditing && (
            <>
              <Separator />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={!isFormValid || isLoading}
                  className="flex-1 sm:flex-initial"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 sm:flex-initial"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Account Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{wishlistCount}</div>
              <div className="text-sm text-muted-foreground">Wishlist Items</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{user?.tenant?.status || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Account Status</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {user?.createdAt ? 
                  Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 'd'
                  : 'N/A'
                }
              </div>
              <div className="text-sm text-muted-foreground">Days Active</div>
            </div>
          </div>
          
          {/* Additional Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-muted">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-semibold text-primary">{user?.tenant?.name || 'N/A'}</div>
              <div className="text-xs text-muted-foreground">Organization</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-semibold text-primary">{user?.tenant?.subdomain || 'N/A'}</div>
              <div className="text-xs text-muted-foreground">Subdomain</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-semibold text-primary">
                {user?.updatedAt ? 
                  new Date(user.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'N/A'
                }
              </div>
              <div className="text-xs text-muted-foreground">Last Updated</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};