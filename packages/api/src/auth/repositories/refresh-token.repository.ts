import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, RefreshToken } from '@generated/prisma/client';

/**
 * SOLID Principle: Single Responsibility
 * This repository manages persistent sessions (Refresh Tokens).
 * It allows us to track and revoke sessions globally.
 */
@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Saves a new refresh token.
   */
  async create(data: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  /**
   * Finds a token by its hash.
   */
  async findByToken(tokenHash: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });
  }

  /**
   * Revokes a specific token.
   */
  async revoke(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revoked: true },
    });
  }

  /**
   * Revokes all tokens for a user (Security "Nuke" button).
   */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  /**
   * Deletes expired tokens to keep the DB clean (Millions of users cleanup).
   */
  async deleteExpired(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}