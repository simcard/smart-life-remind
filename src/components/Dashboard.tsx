import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Plus, Bell, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReminderCard } from "./ReminderCard";
import { QuickStats } from "./QuickStats";
import { UpcomingReminders } from "./UpcomingReminders";
import { AddReminderDialog } from "./AddReminderDialog";
import { ProfileMenu } from "./ProfileMenu";
import { useReminderStore } from "@/store/reminderStore";
import { useAuthStore } from "@/store/authStore";
const mockReminders = [
  {
    id: "1",
    title: "Doctor Appointment",
    category: "appointment" as const,
    due_date: "2024-08-27",
    time: "10:00 AM",
    priority: "high" as const,
    description: "Annual checkup with Dr. Smith",
    completed: false
  },
  {
    id: "2", 
    title: "Passport Renewal",
    category: "document" as const,
    due_date: "2024-09-15",
    time: "All Day",
    priority: "medium" as const,
    description: "Passport expires in 3 weeks",
    completed: false
  },
  {
    id: "3",
    title: "Netflix Subscription",
    category: "subscription" as const, 
    due_date: "2024-09-01",
    time: "Auto-renew",
    priority: "low" as const,
    description: "Monthly renewal - $15.99",
    completed: true
  },
  {
    id: "4",
    title: "Mom's Birthday",
    category: "personal" as const,
    due_date: "2024-09-10",
    time: "All Day", 
    priority: "high" as const,
    description: "Don't forget to call!",
    completed: false
  },
  {
    id: "5",
    title: "Car Insurance Renewal",
    category: "document" as const,
    due_date: "2024-08-30",
    time: "All Day",
    priority: "medium" as const,
    description: "Policy expires end of month",
    completed: false
  },
  {
    id: "6",
    title: "Dentist Checkup",
    category: "appointment" as const,
    due_date: "2024-09-05",
    time: "2:00 PM",
    priority: "low" as const,
    description: "6-month cleaning appointment",
    completed: true
  }
];

export const Dashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const { user, isAuthenticated } = useAuthStore();
  const { reminders, getReminders, isLoading } = useReminderStore();

  useEffect(() => {
    if (isAuthenticated) {
      getReminders();
    }
  }, [isAuthenticated]);

  const dashboardReminders = useMemo(() => {
    return isAuthenticated ? reminders : mockReminders;
  }, [isAuthenticated, reminders]);

  const handleComplete = (id: string) => {
    console.log("Completing reminder:", id);
    // In a real app, this would update the reminder in state/database
  };

  const handlePostpone = (id: string) => {
    console.log("Postponing reminder:", id);
    // In a real app, this would update the reminder date
  };

  const handleEdit = (updatedReminder: any) => {
    console.log("Editing reminder:", updatedReminder);
    // In a real app, this would update the reminder in state/database
  };

  const handleDelete = (id: string) => {
    console.log("Deleting reminder:", id);
    // In a real app, this would remove the reminder from state/database
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  SmartRemind
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search reminders..." 
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="icon" className="sm:hidden w-8 h-8">
                <Filter className="w-4 h-4" />
              </Button>
              <AddReminderDialog 
                preSelectedCategory={selectedCategory}
                isOpen={dialogOpen}
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) setSelectedCategory(undefined);
                }}
              />
              <ProfileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">

          {/* Main Dashboard Area - Shows first on mobile */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 order-1 lg:order-2">
            
            {/* Welcome Section */}
            <div className="bg-gradient-primary rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-medium">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Good morning!</h2>
              <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6">You have 3 upcoming reminders today. Stay on top of your schedule!</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                <Link to="/calendar" className="flex-1 sm:flex-none">
                  <Button variant="secondary" className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
                <Link to="/activity" className="flex-1 sm:flex-none">
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent Activity
                  </Button>
                </Link>
              </div>
            </div>

            {/* Categories Overview */}
            <Card className="shadow-soft">
              <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-primary rounded-md flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Today's Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {dashboardReminders.slice(0, 4).map((reminder) => (
                    <ReminderCard 
                      key={reminder.id} 
                      reminder={reminder}
                      onComplete={handleComplete}
                      onPostpone={handlePostpone}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <Card 
                className="p-3 sm:p-4 hover:shadow-medium transition-all duration-200 cursor-pointer group"
                onClick={() => handleCategoryClick("appointment")}
              >
                <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-category-appointment/10 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-category-appointment/20 transition-colors">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-category-appointment" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Appointment</span>
                </div>
              </Card>
              
              <Card 
                className="p-3 sm:p-4 hover:shadow-medium transition-all duration-200 cursor-pointer group"
                onClick={() => handleCategoryClick("document")}
              >
                <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-category-document/10 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-category-document/20 transition-colors">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-category-document" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Document</span>
                </div>
              </Card>
              
              <Card 
                className="p-3 sm:p-4 hover:shadow-medium transition-all duration-200 cursor-pointer group"
                onClick={() => handleCategoryClick("subscription")}
              >
                <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-category-subscription/10 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-category-subscription/20 transition-colors">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-category-subscription" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Subscription</span>
                </div>
              </Card>
              
              <Card 
                className="p-3 sm:p-4 hover:shadow-medium transition-all duration-200 cursor-pointer group"
                onClick={() => handleCategoryClick("personal")}
              >
                <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-category-personal/10 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-category-personal/20 transition-colors">
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-category-personal" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Personal</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar - Quick Stats & Upcoming (Shows after main content on mobile) */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1">
            <QuickStats />
            <UpcomingReminders reminders={dashboardReminders.slice(0, 3)} />
          </div>
        </div>
      </main>
    </div>
  );
};
