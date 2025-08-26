import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  category: "appointment" | "document" | "subscription" | "personal" | "custom";
  date: string;
  time: string;
  priority: "low" | "medium" | "high";
  description: string;
}

interface UpcomingRemindersProps {
  reminders: Reminder[];
}

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/10 text-warning", 
  high: "bg-destructive/10 text-destructive"
};

export const UpcomingReminders = ({ reminders }: UpcomingRemindersProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary" />
          Upcoming
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="border border-border/50 rounded-lg p-3 hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm line-clamp-1">{reminder.title}</h4>
              <Badge className={`text-xs ${priorityColors[reminder.priority]}`}>
                {reminder.priority}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
              {reminder.description}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{reminder.date}</span>
              <span className="mx-2">•</span>
              <span>{reminder.time}</span>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t border-border/50">
          <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            View all reminders →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};