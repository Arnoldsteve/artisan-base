import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { IStorefrontAuthRepository } from './interfaces/storefront-auth-repository.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StorefrontAuthService {
  constructor(
    @Inject('StorefrontAuthRepository')
    private readonly authRepository: IStorefrontAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.authRepository.findCustomerByEmail(dto.email);
    if (existing) {
      if (existing.hashedPassword) {
        throw new BadRequestException('User already registered. Please login.');
      }
      // Complete registration for customer created via order
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      await this.authRepository.updateCustomerPassword(
        dto.email,
        hashedPassword,
      );
      await this.authRepository.updateCustomerDetails(dto.email, {
        firstName: dto.firstName || existing.firstName,
        lastName: dto.lastName || existing.lastName,
        phone: dto.phone || existing.phone,
      });
      // Issue JWT after completing registration
      const customer = await this.authRepository.findCustomerByEmail(dto.email);
      const payload = { email: customer.email, sub: customer.id };
      const accessToken = this.jwtService.sign(payload);
      const { hashedPassword: _, ...customerWithoutPassword } = customer;
      return {
        message: 'Registration completed. You can now login.',
        accessToken,
        customer: customerWithoutPassword,
      };
    }
    // New registration
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const customer = await this.authRepository.createCustomer({
      email: dto.email,
      hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
    });
    const payload = { email: customer.email, sub: customer.id };
    const accessToken = this.jwtService.sign(payload);
    const { hashedPassword: _, ...customerWithoutPassword } = customer;
    return {
      message: 'Registration successful. You are now logged in.',
      accessToken,
      customer: customerWithoutPassword,
    };
  }

  async login(dto: LoginDto) {
    const customer = await this.authRepository.findCustomerByEmail(dto.email);
    if (!customer || !customer.hashedPassword) {
      throw new BadRequestException('Invalid credentials.');
    }
    const isMatch = await bcrypt.compare(dto.password, customer.hashedPassword);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials.');
    }
    const payload = { email: customer.email, sub: customer.id };
    const accessToken = this.jwtService.sign(payload);
    const { hashedPassword: _, ...customerWithoutPassword } = customer;
    return {
      message: 'Login successful',
      accessToken,
      customer: customerWithoutPassword,
    };
  }

  async completeRegistration(dto: CompleteRegistrationDto) {
    const customer = await this.authRepository.findCustomerByEmail(dto.email);
    if (!customer || customer.hashedPassword) {
      throw new BadRequestException(
        'Invalid or already completed registration.',
      );
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.authRepository.updateCustomerPassword(dto.email, hashedPassword);
    // Optionally, update other details if needed
    const updatedCustomer = await this.authRepository.findCustomerByEmail(
      dto.email,
    );
    const payload = { email: updatedCustomer.email, sub: updatedCustomer.id };
    const accessToken = this.jwtService.sign(payload);
    const { hashedPassword: _, ...customerWithoutPassword } = updatedCustomer;
    return {
      message: 'Registration completed. You are now logged in.',
      accessToken,
      customer: customerWithoutPassword,
    };
  }
}
