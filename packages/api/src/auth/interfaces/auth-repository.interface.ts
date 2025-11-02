import { UserProfileResponseDto } from '../dto/user-profile.dto';
import { User, Tenant, RefreshToken } from '../../../generated/management';

/**
 * Defines the contract for the authentication repository.
 * Ensures a clean separation between service and data access layers.
 */
export interface IAuthRepository {
  // ---------- User methods ----------

  getProfile(userId: string): Promise<UserProfileResponseDto>;

  findUserByEmail(email: string): Promise<User | null>;

  createUser(data: {
    email: string;
    hashedPassword: string;
    firstName: string;
    lastName?: string;
  }): Promise<User>;

  findTenantsByOwnerId(
    ownerId: string,
  ): Promise<Pick<Tenant, 'id' | 'name' | 'subdomain'>[]>;

  // ---------- Refresh token methods ----------

  createRefreshToken(data: {
    userId: string;
    tokenHash: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    familyId?: string | null;
    parentTokenId?: string | null;
    expiresAt: Date;
  }): Promise<RefreshToken>;

  findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null>;

  findRefreshTokenById(id: string): Promise<RefreshToken | null>;

  revokeRefreshTokenById(id: string): Promise<RefreshToken>;

  revokeRefreshTokenByHash(tokenHash: string): Promise<{ count: number }>;

  revokeAllRefreshTokensForUser(userId: string): Promise<{ count: number }>;

  deleteExpiredTokens(): Promise<{ count: number }>;

  findActiveRefreshTokensForUser(userId: string): Promise<RefreshToken[]>;
}
