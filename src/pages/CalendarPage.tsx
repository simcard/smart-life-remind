import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ReminderCard } from "@/components/ReminderCard";

const mockReminders = [
  {
    id: "1",
    title: "Doctor Appointment",
    category: "appointment" as const,
    date: "2024-08-27",
    time: "10:00 AM",
    priority: "high" as const,
    description: "Annual checkup with Dr. Smith",
    completed: false
  },
  {
    id: "2", 
    title: "Passport Renewal",
    category: "document" as const,
    date: "2024-09-15",
    time: "All Day",
    priority: "medium" as const,
    description: "Passport expires in 3 weeks",
    completed: false
  },
  {
    id: "3",
    title: "Mom's Birthday",
    category: "personal" as const,
    date: "2024-09-10",
    time: "All Day", 
    priority: "high" as const,
    description: "Don't forget to call!",
    completed: false
  }
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleComplete = (id: string) => {
    console.log("Completing reminder:", id);
  };

  const handlePostpone = (id: string) => {
    console.log("Postponing reminder:", id);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Calendar View
                </h1>
              </div>
            </div>
            <Button className="bg-gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Calendar Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Reminders</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>This Month</span>
                    <Badge className="bg-primary/10 text-primary">8</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Overdue</span>
                    <Badge className="bg-destructive/10 text-destructive">2</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reminders for Selected Date */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>
                  Reminders for {selectedDate?.toLocaleDateString() || "Today"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockReminders.map((reminder) => (
                  <ReminderCard 
                    key={reminder.id} 
                    reminder={reminder}
                    variant="compact"
                    onComplete={handleComplete}
                    onPostpone={handlePostpone}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Monthly Overview */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>This Month Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-category-appointment/10 rounded-lg">
                    <div className="text-2xl font-bold text-category-appointment">5</div>
                    <div className="text-sm text-muted-foreground">Appointments</div>
                  </div>
                  <div className="text-center p-4 bg-category-document/10 rounded-lg">
                    <div className="text-2xl font-bold text-category-document">3</div>
                    <div className="text-sm text-muted-foreground">Documents</div>
                  </div>
                  <div className="text-center p-4 bg-category-subscription/10 rounded-lg">
                    <div className="text-2xl font-bold text-category-subscription">2</div>
                    <div className="text-sm text-muted-foreground">Subscriptions</div>
                  </div>
                  <div className="text-center p-4 bg-category-personal/10 rounded-lg">
                    <div className="text-2xl font-bold text-category-personal">4</div>
                    <div className="text-sm text-muted-foreground">Personal</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}