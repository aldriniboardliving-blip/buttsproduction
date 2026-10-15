'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { setupAction } from '../setup/actions';

export default function SetupPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const result = await setupAction(token, email, password, name);

      if (result.success) {
        router.push('/admin/login');
        router.refresh();
      } else {
        setError(result.error.message);
      }
    });
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Initial Setup</h1>
          <p className="text-sm text-neutral-600 mt-2">
            Create the first admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <Input
            label="Setup Token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            placeholder="Enter the setup token from your environment"
          />

          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Your full name"
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="admin@example.com"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
            hint="Must be at least 8 characters"
          />

          <Button type="submit" fullWidth loading={isPending}>
            Create Admin Account
          </Button>
        </form>
      </Card>
    </main>
  );
}
