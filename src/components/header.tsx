'use client';

import Link from 'next/link';
import { LogIn, LogOut, User as UserIcon, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChangePasswordDialog } from '@/components/change-password-dialog';
import { useState } from 'react';
import Image from 'next/image';
import { useSiteInfo } from '@/lib/use-site-info';
import { Skeleton } from './ui/skeleton';

function getInitials(name?: string | null) {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

export default function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { siteInfo, isLoading: isSiteInfoLoading } = useSiteInfo();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="mr-auto">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="MR Bebidas Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              {isSiteInfoLoading ? (
                 <Skeleton className="h-6 w-24" />
              ) : (
                <span className="text-lg font-bold">{siteInfo.siteName}</span>
              )}
            </div>
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            {isUserLoading ? (
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.photoURL ?? ''}
                        alt={user.displayName ?? 'Usuário'}
                      />
                      <AvatarFallback>
                        {getInitials(user.email) || <UserIcon />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || 'Usuário'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setIsChangePasswordOpen(true)}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    <span>Alterar Senha</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">
                  <LogIn className="mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      {user && (
        <ChangePasswordDialog
          isOpen={isChangePasswordOpen}
          onOpenChange={setIsChangePasswordOpen}
        />
      )}
    </>
  );
}
