export interface ReminderRequest {
  assigned_member_id?: string,
  title: string,
  description?: string,
  category: string,
  priority: string,
  due_date: string,
  due_time?: string,
  location?: string
}

export interface Reminder {
  id: string;
  title: string;
  category: "appointment" | "document" | "subscription" | "personal" | "custom";
  due_date: string;
  time: string;
  priority: "low" | "medium" | "high";
  description: string;
  completed?: boolean;
  location?: string;
  location_lat?: number;
  location_lng?: number;
}
    
