import { Tenant } from './tenant'; 

/**
 * Defines the shape of the main User object, as returned by the API.
 * This should match the user object within your LoginResponse and ProfileResponse.
 */
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  // Add any other user properties you might have, like 'role'
}

/**
 * Describes the successful response from the /auth/profile endpoint.
 * This is used to validate an existing session.
 */
export interface ProfileResponse {
  user: User;
  organizations: Tenant[];
}