import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { IAuthRepository } from './interfaces/auth-repository.interface';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserProfileResponseDto } from './dto/user-profile.dto';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AuthRepository') private readonly authRepository: IAuthRepository,
    private jwtService: JwtService,
  ) {}

  // ------------------- SIGNUP -------------------
  async signUp(signUpDto: SignUpDto, ipAddress?: string, userAgent?: string) {
    const { email, password, firstName, lastName } = signUpDto;

    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await this.authRepository.createUser({
      email,
      hashedPassword,
      firstName,
      lastName,
    });

    // Remove password from response
    const { hashedPassword: _, ...userWithoutPassword } = user;

    // Create short-lived Access Token (15 min)
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '360m' });

    // Create and store Refresh Token (with IP & user-agent tracking)
    const { refreshToken } = await this.createAndStoreRefreshToken(
      user.id,
      ipAddress,
      userAgent,
    );

    return {
      message: 'Signup successful',
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  // ------------------- LOGIN -------------------
  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { email, password } = loginDto;

    const user = await this.authRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      throw new UnauthorizedException(
        'Invalid credentials. Please check your email and password.',
      );
    }

    const organizations = await this.authRepository.findTenantsByOwnerId(
      user.id,
    );

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '360m' });

    // Create Refresh Token and save in DB
    const { refreshToken } = await this.createAndStoreRefreshToken(
      user.id,
      ipAddress,
      userAgent,
    );

    const { hashedPassword: _, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: userWithoutPassword,
      organizations,
    };
  }

  // ------------------- PROFILE -------------------
  async getProfile(userId: string): Promise<UserProfileResponseDto> {
    return this.authRepository.getProfile(userId);
  }

  // ------------------- REFRESH TOKEN HELPER -------------------
  private async createAndStoreRefreshToken(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ refreshToken: string }> {
    // Generate a random token
    const refreshToken = randomBytes(64).toString('hex');

    // Hash before saving to DB (never store plain tokens)
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    // 30 days validity
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await this.authRepository.createRefreshToken({
      userId,
      tokenHash,
      ipAddress,
      userAgent,
      expiresAt,
    });

    return { refreshToken };
  }

  // ------------------- REFRESH SESSION -------------------
  async refreshSession(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // ✅ Add validation
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    const storedToken =
      await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (
      !storedToken ||
      storedToken.revoked ||
      storedToken.expiresAt < new Date()
    ) {
      throw new ForbiddenException('Invalid or expired refresh token.');
    }

    // Rotate token
    await this.authRepository.revokeRefreshTokenById(storedToken.id);
    const { refreshToken: newRefreshToken } =
      await this.createAndStoreRefreshToken(
        storedToken.userId,
        ipAddress,
        userAgent,
      );

    // Issue new access token
    const payload = { sub: storedToken.userId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    return { accessToken, refreshToken: newRefreshToken };
  }

  // ------------------- LOGOUT -------------------
  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    await this.authRepository.revokeRefreshTokenByHash(tokenHash);
    return { message: 'Logged out successfully' };
  }
}
