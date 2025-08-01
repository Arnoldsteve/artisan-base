import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAuthRepository } from './interfaces/auth-repository.interface';
import { UserProfileResponseDto } from './dto/user-profile.dto';

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

  async getProfile(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      // Use `include` to fetch the full related tenant objects
      include: {
        // --- FIX 1: Use the correct relation name ---
        ownedTenant: {
          select: {
            id: true,
            name: true,
            subdomain: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // --- FIX 2 & 5: Map the data to the DTO shape ---
    return {
      user: {
        id: user.id,
        email: user.email,
        // No need for nullish coalescing here as the DTO now accepts null
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      // Use the correct property from the user object
      organizations: user.ownedTenant || [],
    };
  }
}
