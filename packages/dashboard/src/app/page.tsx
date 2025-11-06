import { LoginForm } from '@/components/auth/login-form'; // Using Next.js path alias '@'


export default function LoginPage() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <LoginForm />
    </main>
  );
}