import { prisma } from '../lib/prisma';
import type { User } from '../../generated/prisma/client';

export class AuthService {
  static async getUserById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async updateUserProfile(id: string, data: { name?: string; avatarUrl?: string }) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user profile');
    }
  }
}
