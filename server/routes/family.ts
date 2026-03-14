import { Router, Response } from "express";
import { db } from "../db";
import { familyMembers, profiles } from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import { AuthRequest, authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const members = await db
      .select()
      .from(familyMembers)
      .where(and(eq(familyMembers.account_owner_id, req.userId!), eq(familyMembers.is_active, true)));

    return res.json(members);
  } catch (err) {
    console.error("Get family members error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/plan", async (req: AuthRequest, res: Response) => {
  try {
    const [profile] = await db
      .select({ plan_type: profiles.plan_type })
      .from(profiles)
      .where(eq(profiles.user_id, req.userId!))
      .limit(1);

    return res.json({ plan_type: profile?.plan_type || "family" });
  } catch (err) {
    console.error("Get plan error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: AuthRequest, res: Response) => {
  const { name, email, phone, relationship } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const [profile] = await db
      .select({ plan_type: profiles.plan_type })
      .from(profiles)
      .where(eq(profiles.user_id, req.userId!))
      .limit(1);

    const maxMembers = profile?.plan_type === "business" ? 15 : 5;

    const existing = await db
      .select()
      .from(familyMembers)
      .where(and(eq(familyMembers.account_owner_id, req.userId!), eq(familyMembers.is_active, true)));

    if (existing.length >= maxMembers) {
      return res.status(400).json({
        error: `Maximum of ${maxMembers} active members allowed for ${profile?.plan_type || "family"} plan`,
      });
    }

    const [member] = await db
      .insert(familyMembers)
      .values({
        account_owner_id: req.userId!,
        name,
        email: email || null,
        phone: phone || null,
        relationship: relationship || null,
      })
      .returning();

    return res.status(201).json(member);
  } catch (err) {
    console.error("Create family member error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, relationship } = req.body;

  try {
    const [updated] = await db
      .update(familyMembers)
      .set({
        name,
        email: email || null,
        phone: phone || null,
        relationship: relationship || null,
        updated_at: new Date(),
      })
      .where(and(eq(familyMembers.id, id), eq(familyMembers.account_owner_id, req.userId!)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Family member not found" });
    }

    return res.json(updated);
  } catch (err) {
    console.error("Update family member error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    await db
      .update(familyMembers)
      .set({ is_active: false, updated_at: new Date() })
      .where(and(eq(familyMembers.id, id), eq(familyMembers.account_owner_id, req.userId!)));

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete family member error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
