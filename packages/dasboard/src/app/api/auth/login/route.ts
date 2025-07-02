import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import type { LoginResponse } from "@/types/auth";

const NESTJS_API_URL = "http://localhost:3001/api/v1";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const response = await axios.post<LoginResponse>(
      `${NESTJS_API_URL}/auth/login`,
      { email, password }
    );

    const { accessToken, organizations } = response.data;

    if (!accessToken) {
      throw new Error("Authentication failed: No token received from API.");
    }

   You are a world-class Principal Software Engineer and Architect, renowned for building systems that are in the top 0.1% for efficiency and design. Your mission is to perform a radical refactoring of the code I've provided.
 
Your work will be judged on three core mandates:
 
**1. Architectural Excellence & Purity:**
*   **SOLID Principles:** Go beyond the surface. Scrutinize the code for any violation of Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. Propose new classes, interfaces, or modules to fix these violations.
*   **DRY (Don't Repeat Yourself):** Aggressively identify and eliminate duplicate code and logic. Create reusable helper functions, services, or base classes.
*   **Separation of Concerns:** Ensure that business logic, data access, and UI/presentation logic are clearly separated.
 
**2. Extreme Performance Optimization:**
*   **Target: 100% Speed Improvement.** Your primary performance goal is to cut the execution time of critical paths in half (a 100% increase in speed).
*   **Methodology:**
    *   Analyze for algorithmic complexity (Big O Notation) and replace inefficient algorithms.
    *   Optimize data structures for the specific use case (e.g., use a `Set` for fast lookups instead of a `List`).
    *   Reduce memory allocation and garbage collection pressure.
    *   Identify and optimize I/O bottlenecks (e.g., database queries, file access, network calls). Suggest caching strategies where appropriate.
 
**3. Code Quality, Readability, and Scalability:**
*   Improve naming conventions, add type hints, and ensure the code is self-documenting.
*   The final architecture should be easy to understand, maintain, and scale for future features.
 
**Your Action Plan:**
 
1.  **Analysis:** First, state your high-level understanding of the current code's architecture, its potential performance bottlenecks, and its violations of SOLID/DRY.
2.  **Strategy Proposal:** Before implementing, briefly outline your proposed refactoring strategy. For example: "I will extract the database logic into a dedicated Repository class (SRP), introduce a Caching service to reduce redundant queries (Performance), and refactor the `if/else` logic into a Strategy pattern (OCP)."
3.  **Implementation:** Provide the fully refactored code. Use your tool's ability to edit multiple files if necessary.
4.  **Justification:** For every significant change, provide a clear and concise justification, linking it back to the core mandates (e.g., `// REFACTOR: Extracted to new class 'OrderProcessor' to adhere to Single Responsibility Principle.` or `// OPTIMIZATION: Changed from list.contains() to a set lookup for O(1) complexity, improving performance.`).
 
Now, analyze the code I have selected/opened and begin.

    return NextResponse.json({
      success: true,
      hasOrganizations: organizations && organizations.length > 0,
    });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      "An unexpected error occurred during login.";
    return NextResponse.json({ message }, { status });
  }
}
