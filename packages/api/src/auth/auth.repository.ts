import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAuthRepository } from './interfaces/auth-repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: {
    email: string;
    hashedPassword: string;
    firstName: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async findTenantsByOwnerId(ownerId: string) {
    return this.prisma.tenant.findMany({
      where: { ownerId },
      select: { id: true, name: true, subdomain: true },
    });
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
