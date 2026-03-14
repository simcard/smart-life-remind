import { Router, Response } from "express";
import { db } from "../db";
import { userLocations, reminders } from "../../shared/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { AuthRequest, authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", async (req: AuthRequest, res: Response) => {
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "latitude and longitude are required" });
  }

  try {
    const [location] = await db
      .insert(userLocations)
      .values({
        user_id: req.userId!,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      })
      .returning();

    return res.status(201).json(location);
  } catch (err) {
    console.error("Save location error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/nearby-reminders", async (req: AuthRequest, res: Response) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng are required" });
  }

  try {
    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);

    const allReminders = await db
      .select()
      .from(reminders)
      .where(and(eq(reminders.user_id, req.userId!), eq(reminders.completed, false), isNotNull(reminders.location_lat), isNotNull(reminders.location_lng)));

    const nearby = allReminders.filter((r) => {
      if (!r.location_lat || !r.location_lng) return false;
      const rLat = parseFloat(r.location_lat as string);
      const rLng = parseFloat(r.location_lng as string);
      const distance = calculateDistance(userLat, userLng, rLat, rLng);
      return distance <= (r.location_radius || 500);
    });

    return res.json(nearby);
  } catch (err) {
    console.error("Nearby reminders error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default router;
