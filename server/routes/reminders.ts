import { Router, Response } from "express";
import { db } from "../db";
import { reminders } from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import { AuthRequest, authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const result = await db
      .select()
      .from(reminders)
      .where(eq(reminders.user_id, req.userId!));

    const mapped = result.map((r) => ({
      ...r,
      time: r.due_time || "All Day",
      date: r.due_date,
      location_lat: r.location_lat ? parseFloat(r.location_lat as string) : undefined,
      location_lng: r.location_lng ? parseFloat(r.location_lng as string) : undefined,
    }));

    return res.json({ reminders: mapped });
  } catch (err) {
    console.error("Get reminders error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    category,
    priority,
    due_date,
    due_time,
    assigned_member_id,
    location,
    notification_preferences,
  } = req.body;

  if (!title || !category || !due_date) {
    return res.status(400).json({ error: "title, category, and due_date are required" });
  }

  try {
    const [reminder] = await db
      .insert(reminders)
      .values({
        user_id: req.userId!,
        title,
        description: description || null,
        category,
        priority: priority || "medium",
        due_date,
        due_time: due_time || null,
        assigned_member_id: assigned_member_id || null,
        location: location || null,
        notification_preferences: notification_preferences || ["app"],
      })
      .returning();

    return res.status(201).json({ ...reminder, time: reminder.due_time || "All Day" });
  } catch (err) {
    console.error("Create reminder error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    priority,
    due_date,
    due_time,
    assigned_member_id,
    location,
    notification_preferences,
    completed,
  } = req.body;

  try {
    const [updated] = await db
      .update(reminders)
      .set({
        title,
        description: description || null,
        category,
        priority,
        due_date,
        due_time: due_time || null,
        assigned_member_id: assigned_member_id || null,
        location: location || null,
        notification_preferences: notification_preferences || ["app"],
        completed: completed !== undefined ? completed : undefined,
        updated_at: new Date(),
      })
      .where(and(eq(reminders.id, id), eq(reminders.user_id, req.userId!)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    return res.json({ ...updated, time: updated.due_time || "All Day" });
  } catch (err) {
    console.error("Update reminder error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await db
      .delete(reminders)
      .where(and(eq(reminders.id, id), eq(reminders.user_id, req.userId!)));

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete reminder error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
