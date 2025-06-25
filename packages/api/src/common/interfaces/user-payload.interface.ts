export interface UserPayload {
  sub: string;      // The User's unique ID
  email: string;    // The User's email
  // You can add other non-sensitive, frequently needed data here
  // For example:
  // roles?: string[]; 
  // firstName?: string;
}