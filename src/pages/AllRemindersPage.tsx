import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { ReminderCard } from "@/components/ReminderCard";
import { useReminderStore } from "@/store/reminderStore";

export default function AllRemindersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { reminders, getReminders, isLoading } = useReminderStore();

  useEffect(() => {
    getReminders();
  }, []);

  const handleComplete = (id: string) => {
    console.log("Completing reminder:", id);
  };

  const handlePostpone = (id: string) => {
    console.log("Postponing reminder:", id);
  };

  const handleEdit = (updatedReminder: any) => {
    console.log("Editing reminder:", updatedReminder);
  };

  const handleDelete = (id: string) => {
    console.log("Deleting reminder:", id);
  };

  const filteredReminders = (Array.isArray(reminders) ? reminders : []).filter(
    (reminder) =>
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeReminders = filteredReminders.filter((r) => !r.completed);
  const completedReminders = filteredReminders.filter((r) => r.completed);

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
              <h1 className="text-2xl font-bold text-foreground">
                All Reminders
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search reminders..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Categories</h4>
                  <div className="space-y-1">
                    {[
                      "appointment",
                      "document",
                      "subscription",
                      "personal",
                    ].map((category) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className="w-full justify-start cursor-pointer hover:bg-muted/50"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Priority</h4>
                  <div className="space-y-1">
                    {["high", "medium", "low"].map((priority) => (
                      <Badge
                        key={priority}
                        variant="outline"
                        className="w-full justify-start cursor-pointer hover:bg-muted/50"
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reminders Section */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <Card className="shadow-soft">
                <CardContent className="py-16 flex justify-center items-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                    <p className="text-muted-foreground">
                      Loading reminders...
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : filteredReminders.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground text-lg">
                    No reminders found.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="active" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="active">
                    Active ({activeReminders.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({completedReminders.length})
                  </TabsTrigger>
                </TabsList>

                {/* Active Tab */}
                <TabsContent value="active" className="space-y-4">
                  {activeReminders.length === 0 ? (
                    <Card>
                      <CardContent className="py-10 text-center text-muted-foreground">
                        No active reminders.
                      </CardContent>
                    </Card>
                  ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeReminders.map((reminder) => (
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
                  ) : (
                    <div className="space-y-3">
                      {activeReminders.map((reminder) => (
                        <ReminderCard
                          key={reminder.id}
                          reminder={reminder}
                          variant="compact"
                          onComplete={handleComplete}
                          onPostpone={handlePostpone}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Completed Tab */}
                <TabsContent value="completed" className="space-y-4">
                  {completedReminders.length === 0 ? (
                    <Card>
                      <CardContent className="py-10 text-center text-muted-foreground">
                        No completed reminders.
                      </CardContent>
                    </Card>
                  ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedReminders.map((reminder) => (
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
                  ) : (
                    <div className="space-y-3">
                      {completedReminders.map((reminder) => (
                        <ReminderCard
                          key={reminder.id}
                          reminder={reminder}
                          variant="compact"
                          onComplete={handleComplete}
                          onPostpone={handlePostpone}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
