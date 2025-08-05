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
    const { email, password, firstName } = signUpDto;

    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.authRepository.createUser({
      email,
      hashedPassword,
      firstName,
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

    // 1. Find the user
    const user = await this.authRepository.findUserByEmail(email);

    // 2. Validate credentials
    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      throw new UnauthorizedException(
        'Invalid credentials. Please check your email and password.',
      );
    }

    // 3. Fetch all tenants owned by this user.
    const organizations = await this.authRepository.findTenantsByOwnerId(
      user.id,
    );

    // 4. Generate JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // 5. Sign the token
    const accessToken = this.jwtService.sign(payload);

    // 6. Prepare user data for response
    const { hashedPassword: _, ...userWithoutPassword } = user;

    // 7. Return the enhanced response object
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
