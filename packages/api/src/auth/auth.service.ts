import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { IAuthRepository } from './interfaces/auth-repository.interface';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserProfileResponseDto } from './dto/user-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AuthRepository') private readonly authRepository: IAuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, firstName, lastName } = signUpDto;

    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.authRepository.createUser({
      email,
      hashedPassword,
      firstName,
      lastName,
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

    const user = await this.authRepository.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      throw new UnauthorizedException(
        'Invalid credentials. Please check your email and password.',
      );
    }

    const organizations = await this.authRepository.findTenantsByOwnerId(
      user.id,
    );

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const { hashedPassword: _, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      accessToken,
      user: userWithoutPassword,
      organizations,
    };
  }

   async getProfile(userId: string): Promise<UserProfileResponseDto> {
    const profile = await this.authRepository.getProfile(userId);
    return profile;
  }
}
