import {
  Injectable,
  ConflictException,
  UnauthorizedException, 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config'; 
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // Inject both PrismaService and JwtService
   constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService, 
  ) {}

  async signup(email: string, password: string) {
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

    async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.hashedPassword);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    
    //  Get the secret and sign the token here
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET not found in environment variables.');
    }

    return {
      access_token: await this.jwtService.signAsync(payload, { secret }),
    };
  }
}