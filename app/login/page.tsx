'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    if (login(email, password)) {
      router.push('/');
    } else {
      setError('Invalid email or password');
      setPassword('');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Fitty Orders</h1>
            <p className="text-muted-foreground">Admin Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <Input
                type="email"
                placeholder="admin@fitelo.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3 font-semibold">Demo Credentials:</p>
            <div className="space-y-2 text-xs">
              <div className="bg-muted/50 rounded p-2">
                <p className="font-mono text-foreground">admin@fitelo.co / Admin@123</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="font-mono text-foreground">ops@fitelo.co / Ops@123</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="font-mono text-foreground">cs@fitelo.co / Cs@123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
