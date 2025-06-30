// src/types/customers.ts
import { Address } from './orders'; // Reuse the Address type

export interface Customer {
    id: string; // We'll use the email as the ID for simplicity
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    createdAt: string;
    addresses: Address[];
}