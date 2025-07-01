import { Customer, CustomerAddress } from "@/types/customers";

// --- Helper: Define Address Data ---
// It's cleaner to define addresses here and reuse them below.

const addresses: { [key: string]: CustomerAddress[] } = {
  cus_1: [{
    id: "addr_1", type: "shipping", firstName: "John", lastName: "Doe",
    addressLine1: "123 Oak Avenue", addressLine2: "Suite 100", city: "Springfield",
    state: "IL", postalCode: "62704", country: "USA", isDefault: true,
  }],
  cus_2: [{
    id: "addr_2", type: "shipping", firstName: "Jane", lastName: "Smith",
    addressLine1: "456 Maple Drive", addressLine2: "", city: "Shelbyville",
    state: "IL", postalCode: "62565", country: "USA", isDefault: true,
  }],
  cus_4: [
    {
      id: "addr_4a", type: "shipping", firstName: "Michael", lastName: "Brown",
      addressLine1: "101 Pine St", addressLine2: "", city: "San Francisco",
      state: "CA", postalCode: "94105", country: "USA", isDefault: true,
    },
    {
      id: "addr_4b", type: "billing", firstName: "Michael", lastName: "Brown",
      addressLine1: "202 Business Rd", addressLine2: "PO Box 500", city: "San Francisco",
      state: "CA", postalCode: "94104", country: "USA", isDefault: false,
    }
  ],
  cus_5: [{
    id: "addr_5", type: "shipping", firstName: "Emily", lastName: "Davis",
    addressLine1: "789 Palm Way", addressLine2: "", city: "Miami",
    state: "FL", postalCode: "33101", country: "USA", isDefault: true,
  }],
  cus_6: [{
    id: "addr_6", type: "shipping", firstName: "David", lastName: "Wilson",
    addressLine1: "321 Elm St", addressLine2: "Apt 2B", city: "Denver",
    state: "CO", postalCode: "80202", country: "USA", isDefault: true,
  }],
  cus_7: [{
    id: "addr_7", type: "shipping", firstName: "Sarah", lastName: "Martinez",
    addressLine1: "654 Cedar Blvd", addressLine2: "", city: "Houston",
    state: "TX", postalCode: "77001", country: "USA", isDefault: true,
  }],
  cus_10: [{
    id: "addr_10", type: "shipping", firstName: "Daniel", lastName: "Lee",
    addressLine1: "987 Birch Ave", addressLine2: "", city: "Seattle",
    state: "WA", postalCode: "98101", country: "USA", isDefault: true,
  }],
};


// --- The Main Mock Customers Array ---

export const mockCustomers: Customer[] = [
  {
    id: "cus_1",
    firstName: "John",
    lastName: "Doe",
    email: "john.d@example.com",
    phone: "555-001-0001",
    createdAt: new Date("2023-10-25T10:00:00Z").toISOString(),
    updatedAt: new Date("2023-10-25T10:00:00Z").toISOString(),
    addresses: addresses.cus_1,
  },
  {
    id: "cus_2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.s@example.com",
    phone: "555-002-0002",
    createdAt: new Date("2023-11-15T11:30:00Z").toISOString(),
    updatedAt: new Date("2023-11-15T11:30:00Z").toISOString(),
    addresses: addresses.cus_2,
  },
  {
    id: "cus_3",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.j@example.com",
    phone: "555-003-0003",
    createdAt: new Date("2022-05-30T09:00:00Z").toISOString(),
    updatedAt: new Date("2022-05-30T09:00:00Z").toISOString(),
    addresses: [], // Customer with no addresses
  },
  {
    id: "cus_4",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.b@example.com",
    phone: "555-004-0004",
    createdAt: new Date("2024-01-20T15:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-20T15:00:00Z").toISOString(),
    addresses: addresses.cus_4, // Customer with multiple addresses
  },
  {
    id: "cus_5",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.d@example.com",
    phone: "555-005-0005",
    createdAt: new Date("2023-03-12T08:45:00Z").toISOString(),
    updatedAt: new Date("2023-03-12T08:45:00Z").toISOString(),
    addresses: addresses.cus_5,
  },
  {
    id: "cus_6",
    firstName: "David",
    lastName: "Wilson",
    email: "david.w@example.com",
    phone: "555-006-0006",
    createdAt: new Date("2021-12-01T18:20:00Z").toISOString(),
    updatedAt: new Date("2021-12-01T18:20:00Z").toISOString(),
    addresses: addresses.cus_6,
  },
  {
    id: "cus_7",
    firstName: "Sarah",
    lastName: "Martinez",
    email: "sarah.m@example.com",
    phone: "555-007-0007",
    createdAt: new Date("2024-02-28T12:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-28T12:00:00Z").toISOString(),
    addresses: addresses.cus_7,
  },
  {
    id: "cus_8",
    firstName: "Chris",
    lastName: "Garcia",
    email: "chris.g@example.com",
    phone: "555-008-0008",
    createdAt: new Date("2023-08-08T22:10:00Z").toISOString(),
    updatedAt: new Date("2023-08-08T22:10:00Z").toISOString(),
    addresses: [], // Another customer with no addresses
  },
  {
    id: "cus_9",
    firstName: "Jessica",
    lastName: "Rodriguez",
    email: "jessica.r@example.com",
    phone: "555-009-0009",
    createdAt: new Date("2022-11-19T14:55:00Z").toISOString(),
    updatedAt: new Date("2022-11-19T14:55:00Z").toISOString(),
    addresses: [],
  },
  {
    id: "cus_10",
    firstName: "Daniel",
    lastName: "Lee",
    email: "daniel.l@example.com",
    phone: "555-010-0010",
    createdAt: new Date("2024-04-05T11:05:00Z").toISOString(),
    updatedAt: new Date("2024-04-05T11:05:00Z").toISOString(),
    addresses: addresses.cus_10,
  },
  {
    id: "cus_11",
    firstName: "Olivia",
    lastName: "Harris",
    email: "olivia.h@example.com",
    phone: "555-011-0011",
    createdAt: new Date("2023-09-22T13:30:00Z").toISOString(),
    updatedAt: new Date("2023-09-22T13:30:00Z").toISOString(),
    addresses: [],
  },
];