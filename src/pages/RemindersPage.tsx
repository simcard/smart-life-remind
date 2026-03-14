import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RemindersList } from "@/components/RemindersList";
import { useToast } from "@/hooks/use-toast";

const mockReminders = [

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