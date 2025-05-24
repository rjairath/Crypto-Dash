'use client';
import { SiBitcoin } from 'react-icons/si';
import { FaSearch, FaUser, FaGoogle, FaGithub } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signinWithGoogle, signinWithGithub, signOut } from '@/utils/actions';
import type { UserResponse } from '@supabase/supabase-js';
import Image from 'next/image';
import React from 'react';

type ClientHeaderProps = {
    session?: UserResponse;
};

const ClientHeader = ({ session }: ClientHeaderProps) => {
    const [showLoginModal, setShowLoginModal] = React.useState(false);
    const userMetadata = session?.data?.user?.user_metadata ?? {};
    const { name = '', email = '', avatar_url = '' } = userMetadata;

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

                    {!session?.data?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <FaUser />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onSelect={() => setShowLoginModal(true)}
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
                                        width={50}
                                        height={50}
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
                                <DropdownMenuItem onSelect={() => signOut()}>
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </header>

            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sign in to CryptoDash</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Button
                            onClick={signinWithGoogle}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <FaGoogle /> Sign in with Google
                        </Button>
                        <Button
                            onClick={signinWithGithub}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <FaGithub /> Sign in with GitHub
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClientHeader;
