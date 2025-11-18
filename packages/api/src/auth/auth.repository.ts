import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAuthRepository } from './interfaces/auth-repository.interface';
import { UserProfileResponseDto } from './dto/user-profile.dto';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  /* ---------- user methods ---------- */

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: {
    email: string;
    hashedPassword: string;
    firstName: string;
    lastName: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async findTenantsByOwnerId(ownerId: string) {
    return this.prisma.tenant.findMany({
      where: { ownerId },
      select: { id: true, name: true, subdomain: true, status: true },
    });
  }

  async getProfile(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        ownedTenant: {
          select: {
            id: true,
            name: true,
            subdomain: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Map to DTO shape
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      organizations: user.ownedTenant || [],
    };
  }

  /* ---------- refresh token methods ---------- */
  // Note: repository expects the token **already hashed** when creating

  async createRefreshToken(data: {
    userId: string;
    tokenHash: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    familyId?: string | null;
    parentTokenId?: string | null;
    expiresAt: Date;
  }) {
    return this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        familyId: data.familyId ?? null,
        parentTokenId: data.parentTokenId ?? null,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findRefreshTokenByHash(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });
  }

  async findRefreshTokenById(id: string) {
    return this.prisma.refreshToken.findUnique({ where: { id } });
  }

  async revokeRefreshTokenById(id: string) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: { revoked: true },
    });
  }

  async revokeRefreshTokenByHash(tokenHash: string) {
    return this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true },
    });
  }

  async revokeAllRefreshTokensForUser(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }

  async deleteExpiredTokens() {
    return this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }

  async findActiveRefreshTokensForUser(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async savePasswordResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    Logger.debug(`Saving password reset token for userId=${userId}`);
    Logger.debug(`Reset Token: ${tokenHash}`);
    Logger.debug(`Expires At: ${expiresAt.toISOString()}`);
    return { message: 'Logged reset token successfully' };
  }
}
