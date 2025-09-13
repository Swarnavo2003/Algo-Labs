/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, Camera, Save, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

const EditDialogBox = () => {
  const { authUser, updateUser, isUpdatingUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: authUser?.name || "",
    bio: authUser?.bio || "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setEditForm({
        name: authUser?.name || "",
        bio: authUser?.bio || "",
      });
      setSelectedAvatar(null);
      setAvatarPreview(null);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setSelectedAvatar(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    try {
      const updateData: any = {};

      if (editForm.name !== authUser?.name && editForm.name.trim()) {
        updateData.name = editForm.name.trim();
      }

      if (editForm.bio !== authUser?.bio) {
        updateData.bio = editForm.bio;
      }

      if (selectedAvatar) {
        updateData.avatar = selectedAvatar;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        setIsOpen(false);
        return;
      }

      await updateUser(updateData);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!authUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={avatarPreview || authUser.image}
                  alt={authUser.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg">
                  {getInitials(editForm.name || authUser.name)}
                </AvatarFallback>
              </Avatar>

              <Button
                onClick={triggerFileInput}
                size="sm"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

            {selectedAvatar && (
              <p className="text-sm text-muted-foreground">
                New image selected: {selectedAvatar.name}
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isUpdatingUser}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdatingUser}>
            <Save className="w-4 h-4 mr-2" />
            {isUpdatingUser ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogBox;
