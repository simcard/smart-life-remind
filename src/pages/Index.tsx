import { Dashboard } from "@/components/Dashboard";
import { LocationTracker } from "@/components/LocationTracker";

const Index = () => {
  return (
    <div className="space-y-6">
      <Dashboard />
      <LocationTracker />
    </div>
  );
};

export default Index;
