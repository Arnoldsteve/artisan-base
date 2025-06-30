// src/lib/mock-data/customers.ts
import { Customer } from "@/types/customers";

export const mockCustomers: Customer[] = [
    {
        id: 'john.doe@example.com',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '111-222-3333',
        createdAt: '2024-01-15T09:00:00Z',
        addresses: [
            { firstName: 'John', lastName: 'Doe', addressLine1: '123 Main St', city: 'Anytown', state: 'CA', postalCode: '12345', country: 'USA' }
        ]
    },
    {
        id: 'jane.smith@example.com',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '222-333-4444',
        createdAt: '2024-02-01T11:30:00Z',
        addresses: [
            { firstName: 'Jane', lastName: 'Smith', addressLine1: '456 Oak Ave', city: 'Someville', state: 'NY', postalCode: '54321', country: 'USA' }
        ]
    },
    {
        id: 'peter.jones@example.com',
        email: 'peter.jones@example.com',
        firstName: 'Peter',
        lastName: 'Jones',
        phone: '333-444-5555',
        createdAt: '2024-02-20T14:00:00Z',
        addresses: [
            { firstName: 'Peter', lastName: 'Jones', addressLine1: '789 Pine Ln', city: 'Metropolis', state: 'TX', postalCode: '67890', country: 'USA' }
        ]
    },
    // Add other customers...
];