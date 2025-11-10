'use client'


import Link from "next/link";
import { usePathname } from "next/navigation";
import { LegalNavigation as LegalNavigationType } from "@/types/legal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Cookie } from "lucide-react";

interface LegalNavigationProps {
  navigation: LegalNavigationType;
}

const iconMap = {
  privacy: Shield,
  terms: FileText,
  cookies: Cookie,
};

export function LegalNavigation({ navigation }: LegalNavigationProps) {
  const pathname = usePathname();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Legal Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {navigation.pages.map((page) => {
          const Icon = iconMap[page.id as keyof typeof iconMap] || FileText;
          const isActive = pathname === page.path;

          return (
            <Link
              key={page.id}
              href={page.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">{page.title}</div>
                <div className="text-xs opacity-75 truncate">
                  {page.description}
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
