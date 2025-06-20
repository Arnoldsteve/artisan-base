// In packages/api/src/auth/auth.service.ts

import {
  Injectable,
  ConflictException,
  UnauthorizedException, // <-- Import this
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // <-- Import this

@Injectable()
export class AuthService {
  // Inject both PrismaService and JwtService
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // <-- Inject this
  ) {}

  async signup(email: string, password: string) {
    // ... our existing signup code ...
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.prisma.user.create({
      data: { email, hashedPassword },
    });

    const { hashedPassword: _, ...result } = user;
    return result;
  }

  // 1. Add the new login method
  async login(email: string, pass: string) {
    console.log("Test dada")
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.hashedPassword);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. If passwords match, generate the JWT
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}