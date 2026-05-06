import { db } from '../db';
import { users } from '../db/schema';
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
