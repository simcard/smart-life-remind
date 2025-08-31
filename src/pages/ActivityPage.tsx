import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Activity, CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const recentActivities = [
  {
    id: "1",
    type: "completed",
    title: "Dentist Checkup completed",
    description: "6-month cleaning appointment",
    timestamp: "2 hours ago",
    category: "appointment"
  },
  {
    id: "2",
    type: "created",
    title: "Car Insurance Renewal added",
    description: "Policy expires end of month",
    timestamp: "1 day ago",
    category: "document"
  },
  {
    id: "3",
    type: "postponed",
    title: "Gym Membership postponed",
    description: "Moved to next week",
    timestamp: "2 days ago",
    category: "subscription"
  },
  {
    id: "4",
    type: "completed",
    title: "Netflix Subscription completed",
    description: "Monthly renewal - $15.99",
    timestamp: "3 days ago",
    category: "subscription"
  },
  {
    id: "5",
    type: "overdue",
    title: "Tax Documents overdue",
    description: "Submit quarterly tax documents",
    timestamp: "5 days ago",
    category: "document"
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "created":
      return <Calendar className="w-4 h-4 text-primary" />;
    case "postponed":
      return <Clock className="w-4 h-4 text-warning" />;
    case "overdue":
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    default:
      return <Activity className="w-4 h-4 text-muted-foreground" />;
  }
};

const getActivityBadge = (type: string) => {
  switch (type) {
    case "completed":
      return <Badge className="bg-success/10 text-success">Completed</Badge>;
    case "created":
      return <Badge className="bg-primary/10 text-primary">Created</Badge>;
    case "postponed":
      return <Badge className="bg-warning/10 text-warning">Postponed</Badge>;
    case "overdue":
      return <Badge className="bg-destructive/10 text-destructive">Overdue</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default function ActivityPage() {
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
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Recent Activity
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Activity Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <span className="text-xl font-bold text-foreground">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Created</span>
                  </div>
                  <span className="text-xl font-bold text-foreground">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-warning" />
                    </div>
                    <span className="text-sm font-medium">Postponed</span>
                  </div>
                  <span className="text-xl font-bold text-foreground">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    </div>
                    <span className="text-sm font-medium">Overdue</span>
                  </div>
                  <span className="text-xl font-bold text-foreground">1</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-3">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm text-foreground">{activity.title}</h4>
                          {getActivityBadge(activity.type)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{activity.timestamp}</span>
                          <span className="capitalize">{activity.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Load More Activities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}