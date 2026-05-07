import { describe, it, expect, beforeEach } from 'bun:test';
import { app } from '../src/index';
import { db } from '../src/db';
import { users, sessions } from '../src/db/schema';

describe('User API Tests', () => {
  // Clear data before each test
  beforeEach(async () => {
    await db.delete(sessions);
    await db.delete(users);
  });

  describe('POST /api/users (Registration)', () => {
    it('should register a new user successfully', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
          })
        })
      );

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toBe('OK');
    });

    it('should fail if email already exists', async () => {
      // First registration
      await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
          })
        })
      );

      // Second registration with same email
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Another User',
            email: 'test@example.com',
            password: 'password456'
          })
        })
      );

      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.error).toBe('Email sudah terdaftar');
    });

    it('should fail if name exceeds 255 characters', async () => {
      const longName = 'a'.repeat(256);
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: longName,
            email: 'test@example.com',
            password: 'password123'
          })
        })
      );

      expect(response.status).toBe(422);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Register a user for login tests
      await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Login User',
            email: 'login@example.com',
            password: 'password123'
          })
        })
      );
    });

    it('should login successfully and return a token', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'login@example.com',
            password: 'password123'
          })
        })
      );

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toBeDefined();
      expect(typeof result.data).toBe('string');
    });

    it('should fail with wrong password', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'login@example.com',
            password: 'wrongpassword'
          })
        })
      );

      const result = await response.json();
      expect(response.status).toBe(401);
      expect(result.error).toBe('Email atau password salah');
    });
  });

  describe('Auth Required Endpoints', () => {
    let token: string;

    beforeEach(async () => {
      // Register and Login to get token
      await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Auth User',
            email: 'auth@example.com',
            password: 'password123'
          })
        })
      );

      const loginResponse = await app.handle(
        new Request('http://localhost/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'auth@example.com',
            password: 'password123'
          })
        })
      );
      const loginResult = await loginResponse.json();
      token = loginResult.data;
    });

    it('should get current user profile', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/current', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data.email).toBe('auth@example.com');
      expect(result.data.password).toBeUndefined();
    });

    it('should logout successfully', async () => {
      const logoutResponse = await app.handle(
        new Request('http://localhost/api/users/logout', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );

      expect(logoutResponse.status).toBe(200);
      expect((await logoutResponse.json()).data).toBe('OK');

      // Verify token is no longer valid
      const currentResponse = await app.handle(
        new Request('http://localhost/api/users/current', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );
      expect(currentResponse.status).toBe(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/current', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer invalid-token'
          }
        })
      );

      expect(response.status).toBe(401);
    });
  });
});
