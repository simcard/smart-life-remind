import { Router, Response } from "express";
import { db } from "../db";
import { notifications, familyMembers } from "../../shared/schema";
import { eq, inArray } from "drizzle-orm";
import { AuthRequest, authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const members = await db
      .select({ id: familyMembers.id })
      .from(familyMembers)
      .where(eq(familyMembers.account_owner_id, req.userId!));

    if (members.length === 0) {
      return res.json([]);
    }

    const memberIds = members.map((m) => m.id);
    const result = await db
      .select()
      .from(notifications)
      .where(inArray(notifications.recipient_member_id, memberIds));

    return res.json(result);
  } catch (err) {
    console.error("Get notifications error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notification-preferences", async (req: AuthRequest, res: Response) => {
  return res.json({ success: true });
});

export default router;
