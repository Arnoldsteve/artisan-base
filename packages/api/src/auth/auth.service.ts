import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // This is the ManagementPrismaService
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
}
