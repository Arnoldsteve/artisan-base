import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@/user/repositories/user.repository';
import { TenantMemberRepository } from '@/tenant/repositories/tenant-member.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
// import { crypto } from 'crypto'; // For hashing the refresh token

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly memberRepo: TenantMemberRepository,
    private readonly tokenRepo: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates the user's credentials.
   * Standard for Millions of Users: We only return the user if the password matches.
   */
  async validateUser(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return user without the password
    const { hashedPassword, ...result } = user;
    return result;
  }

  /**
   * The Login Flow:
   * 1. Generates Access Token (Short-lived)
   * 2. Generates Refresh Token (Long-lived & Persisted)
   * 3. Discovers available Tenants for this user
   */
  async login(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      globalRole: user.globalRole 
    };

    // Find which tenants this user can access
    const memberships = await this.memberRepo.listByUser(user.id);
    const tenants = memberships.map(m => ({
      id: m.tenantId,
      name: m.tenant.name,
      subdomain: m.tenant.subdomain,
      role: m.role
    }));

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        globalRole: user.globalRole,
      },
      tenants, // Tells the frontend which stores this user can manage
      backend_tokens: {
        accessToken,
        refreshToken,
      }
    };
  }

  /**
   * Helper to create and persist a refresh token.
   */
  private async createRefreshToken(userId: string): Promise<string> {
    const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const tokenHash = this.hashToken(token);
    
    // Set expiration to 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.tokenRepo.create({
      userId,
      tokenHash,
      expiresAt,
    });

    return token;
  }

  private hashToken(token: string): string {
    return require('crypto').createHash('sha256').update(token).digest('hex');
  }
}