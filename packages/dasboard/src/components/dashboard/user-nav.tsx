'use client';

import { Button } from '@repo/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react'; // Import the chevron icon

export function UserNav() {
  const router = useRouter();

  // In a real app, this data would come from a session or user context
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  const handleLogout = () => {
    // Add your actual logout logic here (e.g., clear session, cookies)
    console.log('Logging out...');
    router.push('/'); // Redirect to login page
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* The trigger is now a simple button with the user's name and an icon */}
        <Button variant="ghost" className="relative flex items-center gap-2 px-2">
          <span>{user.firstName} {user.lastName}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      {/* The content of the dropdown remains the same */}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}