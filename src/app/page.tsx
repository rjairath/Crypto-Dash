import CryptoTable from '@/components/CryptoTable';
import { SiBitcoin } from 'react-icons/si';
import { FaSearch, FaUser } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const page = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <FaUser />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="p-6">
                <h1 className="text-2xl font-semibold mb-4">
                    Top Cryptocurrencies
                </h1>
                <CryptoTable />
            </main>
        </div>
    );
};

export default page;
