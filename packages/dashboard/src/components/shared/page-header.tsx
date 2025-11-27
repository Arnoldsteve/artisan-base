interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">

      <div className="flex h-10 items-center px-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight ">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {/* The action button(s) will be rendered here */}
        {children && <div className="ml-auto">{children}</div>}
      </div>
    </div>
  );
}
