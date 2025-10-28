/**
 * Header Component for Highway Delite
 * Responsive navigation bar with improved shadcn design
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import Link from 'next/link';

export const Header: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
            // Don't clear searchQuery here so user can see what they searched
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 cursor-pointer transition-transform hover:scale-105">
                        <Image
                            src="/logo.png"
                            alt="Highway Delite Logo"
                            width={140}
                            height={70}
                            className="object-contain w-auto"
                        />
                    </Link>

                    {/* Desktop Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-8 gap-4">
                        <div className="relative w-full">
                            <Input
                                type="text"
                                placeholder="Search experiences"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="rounded-md p-[20px] bg-[#EDEDED] border-none outline-none focus:ring-0 focus:ring-transparent focus:outline-none"
                            />

                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="rounded-md p-[20px] bg-[#FFD643]"
                        >
                            Search
                        </Button>
                    </form>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 py-6 space-y-4">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Search experiences..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-10"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="h-10 px-4"
                                >
                                    Search
                                </Button>
                            </form>

                            {/* Mobile Navigation */}
                            <nav className="flex flex-col space-y-2">
                                <Button
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => {
                                        router.push('/');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Home
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => {
                                        router.push('/experiences');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Experiences
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => {
                                        router.push('/about');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    About
                                </Button>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
