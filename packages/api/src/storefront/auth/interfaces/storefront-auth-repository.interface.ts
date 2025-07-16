export interface IStorefrontAuthRepository {
  findCustomerByEmail(email: string): Promise<any | null>;
  createCustomer(data: {
    email: string;
    hashedPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<any>;
  updateCustomerPassword(email: string, hashedPassword: string): Promise<any>;
  updateCustomerDetails(
    email: string,
    data: Partial<{ firstName: string; lastName: string; phone: string }>,
  ): Promise<any>;
}
