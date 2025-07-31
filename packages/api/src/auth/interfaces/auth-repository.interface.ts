export interface IAuthRepository {
  getProfile(userId: string): unknown;
  findUserByEmail(email: string): Promise<any | null>;
  createUser(data: {
    email: string;
    hashedPassword: string;
    firstName: string;
  }): Promise<any>;
  findTenantsByOwnerId(
    ownerId: string,
  ): Promise<Array<{ id: string; name: string; subdomain: string }>>;
}
