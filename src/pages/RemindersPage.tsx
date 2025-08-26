import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RemindersList } from "@/components/RemindersList";
import { useToast } from "@/hooks/use-toast";

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
    title: "Netflix Subscription",
    category: "subscription" as const, 
    date: "2024-09-01",
    time: "Auto-renew",
    priority: "low" as const,
    description: "Monthly renewal - $15.99",
    completed: true
  },
  {
    id: "4",
    title: "Mom's Birthday",
    category: "personal" as const,
    date: "2024-09-10",
    time: "All Day", 
    priority: "high" as const,
    description: "Don't forget to call!",
    completed: false
  },
  {
    id: "5",
    title: "Car Insurance Renewal",
    category: "document" as const,
    date: "2024-08-30",
    time: "All Day",
    priority: "medium" as const,
    description: "Policy expires end of month",
    completed: false
  },
  {
    id: "6",
    title: "Dentist Checkup",
    category: "appointment" as const,
    date: "2024-09-05",
    time: "2:00 PM",
    priority: "low" as const,
    description: "6-month cleaning appointment",
    completed: true
  },
  {
    id: "7",
    title: "Spotify Premium",
    category: "subscription" as const,
    date: "2024-09-12",
    time: "Auto-renew",
    priority: "low" as const,
    description: "Monthly subscription - $9.99",
    completed: false
  },
  {
    id: "8",
    title: "Wedding Anniversary",
    category: "personal" as const,
    date: "2024-09-20",
    time: "All Day",
    priority: "high" as const,
    description: "Book dinner reservation",
    completed: false
  }
];

export const RemindersPage = () => {
  const { toast } = useToast();
  const [reminders, setReminders] = useState(mockReminders);

  const handleComplete = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: true }
          : reminder
      )
    );
  };

  const handlePostpone = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { 
              ...reminder, 
              date: new Date(new Date(reminder.date).getTime() + 24 * 60 * 60 * 1000)
                .toISOString().split('T')[0]
            }
          : reminder
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <RemindersList
          reminders={reminders}
          title="All Reminders"
          onComplete={handleComplete}
          onPostpone={handlePostpone}
        />
      </main>
    </div>
  );
};