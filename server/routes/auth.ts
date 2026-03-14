import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users, profiles } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "../middleware/auth";

const router = Router();

router.post("/users", async (req: Request, res: Response) => {
  const { email, password, full_name, avatar_url, plan_type } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({ email, password_hash, full_name: full_name || null, avatar_url: avatar_url || null, plan_type: plan_type || "family" })
      .returning();

    await db.insert(profiles).values({
      user_id: user.id,
      full_name: user.full_name,
      email: user.email,
      plan_type: user.plan_type,
    });

    const { password_hash: _, ...safeUser } = user;
    return res.status(201).json({ user: safeUser });
  } catch (err) {
    console.error("Sign up error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.id);
    const { password_hash: _, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
