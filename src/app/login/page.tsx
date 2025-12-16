'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Attempt to sign in first
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
      toast({
        title: 'Login bem-sucedido!',
        description: 'Você foi autenticado.',
      });
    } catch (error: any) {
      // If user not found, try to create a new account
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          router.push('/');
          toast({
            title: 'Cadastro realizado com sucesso!',
            description: 'Sua conta foi criada e você já está logado.',
          });
        } catch (signUpError: any) {
          console.error('Falha no cadastro:', signUpError);
          toast({
            variant: 'destructive',
            title: 'Falha no cadastro',
            description: signUpError.message || 'Não foi possível criar sua conta.',
          });
        }
      } else {
        console.error('Falha no login:', error);
        let description = 'Ocorreu um erro desconhecido.';
        if (error.code === 'auth/wrong-password') {
          description = 'Senha incorreta. Verifique seus dados.';
        }
        toast({
          variant: 'destructive',
          title: 'Falha no login',
          description,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Entre com seu usuário e senha para gerenciar os produtos. Se não
            tiver uma conta, ela será criada automaticamente.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Usuário (E-mail)</Label>
              <Input
                id="email"
                type="email"
                placeholder="seunome@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
