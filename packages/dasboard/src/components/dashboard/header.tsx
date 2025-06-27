import { UserNav } from '@/components/dashboard/user-nav';
import { Input } from '@repo/ui';

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* You can add a TeamSwitcher or Logo here */}
        <h1 className="text-xl font-bold tracking-tight mr-6 text-rose-400">My Store</h1>
        

        <div className="ml-auto flex items-center space-x-4">
          {/* Simple search input, can be its own component later */}
          <div>
            <Input
              type="search"
              placeholder="Search..."
              className="md:w-[100px] lg:w-[300px]"
            />
          </div>
          <UserNav />
        </div>
      </div>
    </div>
  );
}