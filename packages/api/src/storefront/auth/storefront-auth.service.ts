import {
  Injectable,
  BadRequestException,
  Scope,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { StorefrontAuthRepository } from './storefront-auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable({ scope: Scope.REQUEST })
export class StorefrontAuthService {
  constructor(
    private readonly authRepository: StorefrontAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.authRepository.findCustomerByEmail(dto.email);

    if (existing) {
      if (existing.hashedPassword) {
        throw new BadRequestException('User already registered. Please login.');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      await this.authRepository.updateCustomerPassword(
        dto.email,
        hashedPassword,
      );

      // --- FIX 1: Nullish Coalescing ---
      // Use `??` to handle potential `null` values from the database.
      await this.authRepository.updateCustomerDetails(dto.email, {
        firstName: dto.firstName ?? existing.firstName ?? undefined,
        lastName: dto.lastName ?? existing.lastName ?? undefined,
        phone: dto.phone ?? existing.phone ?? undefined,
      });

      const customer = await this.authRepository.findCustomerByEmail(dto.email);

      // --- FIX 2: Type Guard ---
      // Check for null before using the object.
      if (!customer) {
        throw new NotFoundException('Failed to retrieve customer after update.');
      }

      const payload = { email: customer.email, sub: customer.id };
      const accessToken = this.jwtService.sign(payload);
      const { hashedPassword: _, ...customerWithoutPassword } = customer;

      return {
        message: 'Registration completed. You can now login.',
        accessToken,
        customer: customerWithoutPassword,
      };
    }

    // New registration logic remains the same
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

    const updatedCustomer = await this.authRepository.findCustomerByEmail(
      dto.email,
    );

    // --- FIX 2 (Again): Type Guard ---
    if (!updatedCustomer) {
      throw new NotFoundException('Failed to retrieve customer after completing registration.');
    }

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