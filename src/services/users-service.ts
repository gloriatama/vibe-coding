import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';

export const registerUser = async ({ name, email, password }: any) => {
  // Check if email already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  // Hash password using Bun's internal password API (bcrypt)
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 10,
  });

  // Insert user
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: 'OK' };
};

export const loginUser = async ({ email, password }: any) => {
  // Find user by email
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error('Email atau password salah');
  }

  // Verify password
  const isPasswordValid = await Bun.password.verify(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Email atau password salah');
  }

  // Generate token
  const token = crypto.randomUUID();

  // Create session
  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return { data: token };
};

export const getCurrentUser = async (token: string) => {
  // Find session and join with user
  const sessionWithUser = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
    with: {
      user: true,
    },
  });

  if (!sessionWithUser) {
    throw new Error('Unauthorized');
  }

  const { password, ...userData } = sessionWithUser.user;
  return { data: userData };
};

export const logoutUser = async (token: string) => {
  // Delete session and return deleted rows
  const deletedSessions = await db.delete(sessions)
    .where(eq(sessions.token, token))
    .returning();

  if (deletedSessions.length === 0) {
    throw new Error('Unauthorized');
  }

  return { data: 'OK' };
};
