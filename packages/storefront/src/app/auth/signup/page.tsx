"use client";
import { useState } from "react";
import { useAuthForm } from "@/hooks/use-auth-form";
import { signup } from "@/services/auth-service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const { error, loading, handleSubmit } = useAuthForm(signup, "/account");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-black text-sm font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Home
        </Link>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit({ email, password, firstName, lastName, phone });
        }}
        className="w-full max-w-sm p-8 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone (optional)</label>
          <input
            type="tel"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <p className="mt-4 text-center text-sm">
          Already have account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
              Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
