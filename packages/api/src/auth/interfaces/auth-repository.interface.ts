// File: packages/api/src/auth/interfaces/auth-repository.interface.ts

import { UserProfileResponseDto } from '../dto/user-profile.dto';
// It's best practice to use the specific, generated Prisma types where possible.
import { User, Tenant } from '../../../generated/management';

/**
 * Defines the contract for the authentication repository.
 * This interface ensures a clean separation between the service layer and the data access layer.
 */
export interface IAuthRepository {
  /**
   * Fetches a user's profile information along with their associated organizations.
   * @param userId The ID of the user to fetch.
   * @returns A promise that resolves to the structured user profile DTO.
   */
  getProfile(userId: string): Promise<UserProfileResponseDto>;

  /**
   * Finds a single user by their email address.
   * @param email The email of the user to find.
   * @returns A promise that resolves to the full User object or null if not found.
   */
  findUserByEmail(email: string): Promise<User | null>;

  /**
   * Creates a new user in the database.
   * @param data The necessary data to create a new user.
   * @returns A promise that resolves to the newly created User object.
   */
  createUser(data: {
    email: string;
    hashedPassword: string;
    firstName: string;
    // lastName is optional, so it's not required here
    lastName?: string;
  }): Promise<User>;

  /**
   * Finds all tenants owned by a specific user.
   * @param ownerId The ID of the user who owns the tenants.
   * @returns A promise that resolves to an array of tenants with selected fields.
   */
  findTenantsByOwnerId(
    ownerId: string,
  ): Promise<Pick<Tenant, 'id' | 'name' | 'subdomain'>[]>;
}