'use client';
import { SiBitcoin } from 'react-icons/si';
import { FaSearch, FaUser } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import type { UserResponse } from '@supabase/supabase-js';
import Image from 'next/image';
import React from 'react';
import { LoginModal } from './LoginModal';
import { useQueryClient } from '@tanstack/react-query';

type ClientHeaderProps = {
    session?: UserResponse;
};

const ClientHeader = ({ session }: ClientHeaderProps) => {
    const [showLoginModal, setShowLoginModal] = React.useState(false);
    const userMetadata = session?.data?.user?.user_metadata ?? {};
    const { name = '', email = '', avatar_url = '' } = userMetadata;
    const { signOut, isLoggedIn } = useAuth();
    const queryClient = useQueryClient();

    const handleSignOut = async () => {
        await signOut();
        queryClient.invalidateQueries({ queryKey: ['alerts'] });
    };

    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 shadow-md">
                <div className="flex items-center space-x-2 text-xl font-bold">
                    <SiBitcoin className="text-yellow-500" size={28} />
                    <span>CryptoDash</span>
                </div>

                <div className="flex items-center space-x-4 justify-between">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 w-64"
                        />
                        <FaSearch className="absolute left-3 top-2.5 text-muted-foreground" />
                    </div>

                    {!isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <FaUser className="cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onSelect={() => setShowLoginModal(true)}
                                    className="cursor-pointer"
                                >
                                    Sign in
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                {avatar_url ? (
                                    <Image
                                        src={avatar_url}
                                        alt={name}
                                        width={36}
                                        height={36}
                                        className="rounded-full cursor-pointer"
                                        quality={100}
                                    />
                                ) : (
                                    <FaUser className="cursor-pointer" />
                                )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>{name}</DropdownMenuItem>
                                <DropdownMenuItem>{email}</DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={handleSignOut}
                                    className="cursor-pointer"
                                >
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </header>
            <LoginModal
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
            />
        </>
    );
};

export default ClientHeader;
