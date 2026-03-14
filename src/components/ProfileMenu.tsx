import { useState, useEffect } from "react";
import { User, LogOut, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { FamilyMembersDialog } from "./FamilyMembersDialog";
import { SettingsDialog } from "./SettingsDialog";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/serivces/aut.service";

export const ProfileMenu = () => {

  const [familyDialogOpen, setFamilyDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const { toast } = useToast();
  const {  user, isAuthenticated } = useAuthStore();

  const handleSignOut = async () => {
  logout();
  toast({ title: "Signed out", description: "You have been successfully signed out.", }); }
  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (!isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        onClick={() => window.location.href = '/auth'}
      >
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0 flex-shrink-0">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarFallback className="bg-gradient-primary text-white text-xs sm:text-sm">
                {getUserInitials(user.email || "U")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.email}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                Welcome to SmartRemind
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setFamilyDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            <span>Family Members</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSettingsDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FamilyMembersDialog 
        open={familyDialogOpen} 
        onOpenChange={setFamilyDialogOpen} 
      />
      
      <SettingsDialog 
        open={settingsDialogOpen} 
        onOpenChange={setSettingsDialogOpen} 
      />
    </>
  );
};
