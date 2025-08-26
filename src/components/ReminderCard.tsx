import { Calendar, Clock, AlertCircle, FileText, CreditCard, Heart, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Reminder {
  id: string;
  title: string;
  category: "appointment" | "document" | "subscription" | "personal" | "custom";
  date: string;
  time: string;
  priority: "low" | "medium" | "high";
  description: string;
}

const categoryConfig = {
  appointment: {
    icon: Calendar,
    label: "Appointment",
    color: "category-appointment"
  },
  document: {
    icon: FileText,
    label: "Document", 
    color: "category-document"
  },
  subscription: {
    icon: CreditCard,
    label: "Subscription",
    color: "category-subscription"
  },
  personal: {
    icon: Heart,
    label: "Personal",
    color: "category-personal"
  },
  custom: {
    icon: Settings,
    label: "Custom",
    color: "category-custom"
  }
};

const priorityConfig = {
  low: {
    color: "bg-muted text-muted-foreground",
    label: "Low"
  },
  medium: {
    color: "bg-warning/10 text-warning",
    label: "Medium"
  },
  high: {
    color: "bg-destructive/10 text-destructive",
    label: "High"
  }
};

interface ReminderCardProps {
  reminder: Reminder;
}

export const ReminderCard = ({ reminder }: ReminderCardProps) => {
  const categoryInfo = categoryConfig[reminder.category];
  const priorityInfo = priorityConfig[reminder.priority];
  const Icon = categoryInfo.icon;

  return (
    <Card className="group hover:shadow-medium transition-all duration-200 cursor-pointer border border-border/50 hover:border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              `bg-${categoryInfo.color}/10 group-hover:bg-${categoryInfo.color}/20`
            )}>
              <Icon className={cn("w-5 h-5", `text-${categoryInfo.color}`)} />
            </div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {reminder.title}
              </h3>
              <p className="text-xs text-muted-foreground">{categoryInfo.label}</p>
            </div>
          </div>
          <Badge className={cn("text-xs", priorityInfo.color)}>
            {priorityInfo.label}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {reminder.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3" />
            <span>{reminder.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3" />
            <span>{reminder.time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};