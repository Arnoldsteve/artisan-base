import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // This is the ManagementPrismaService
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  // Inject the ManagementPrismaService
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, firstName } = signUpDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the public.users table
    const user = await this.prisma.user.create({
      data: {
        email,
        hashedPassword,
        firstName,
      },
    });

    const { hashedPassword: _, ...userWithoutPassword } = user;

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Signup successful',
      accessToken,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Find the user (no change here)
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 2. Validate credentials (no change here)
    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      throw new UnauthorizedException(
        'Invalid credentials. Please check your email and password.',
      );
    }

    // --- NEW LOGIC STARTS HERE ---

    // 3. Fetch all tenants owned by this user.
    // We will select only the necessary fields for the frontend to build a selector UI.
    const organizations = await this.prisma.tenant.findMany({
      where: {
        ownerId: user.id,
      },
      select: {
        id: true,
        name: true,
        subdomain: true,
      },
    });

    // --- NEW LOGIC ENDS HERE ---

    // 4. Generate JWT payload (no change here)
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // 5. Sign the token (no change here)
    const accessToken = this.jwtService.sign(payload);

    // 6. Prepare user data for response (no change here)
    const { hashedPassword: _, ...userWithoutPassword } = user;

    // 7. Return the enhanced response object
    return {
      message: 'Login successful',
      accessToken,
      user: userWithoutPassword,
      organizations, // <-- The new, crucial piece of data
    };
  }
}
