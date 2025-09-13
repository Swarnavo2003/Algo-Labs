import { useAuthStore } from "@/store/auth-store";
import { Mail, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSubmissionStore } from "@/store/submission-store";
import { useEffect } from "react";
import SubmissionHeatmap from "@/components/profile/SubmissionHeatmap";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { submissions, isLoading, getUserSubmissions } = useSubmissionStore();

  useEffect(() => {
    if (authUser) {
      getUserSubmissions();
    }
  }, [authUser]);

  if (!authUser) {
    return (
      <div className="w-full h-screen max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto space-y-2">
      <Card className="mt-4">
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={authUser.image}
                  alt={authUser.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl">
                  {getInitials(authUser.name)}
                </AvatarFallback>
              </Avatar>
              {authUser.role === "ADMIN" && (
                <Badge className="absolute -top-2 -right-2 bg-purple-600 hover:bg-purple-700">
                  <Shield className="w-3 h-3 mr-1" />
                  ADMIN
                </Badge>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{authUser.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">
                {authUser.bio}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{authUser.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubmissionHeatmap submissions={submissions} isLoading={isLoading} />
    </div>
  );
};

export default ProfilePage;
