"use client";

import { useMemo } from "react";
import { UserNav } from "@/components/dashboard/user-nav";
import { Input } from "@repo/ui";
import { useAuthContext } from "@/contexts/auth-context";

export function Header() {

  return (
    <div className="border-b border-border bg-background">
      <div className="flex h-16 items-center px-4">

        <div className="ml-auto flex items-center space-x-4">
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