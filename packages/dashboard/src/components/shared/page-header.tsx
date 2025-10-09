interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; 
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-[#FFFFFF]">
      <div className="flex h-10 items-center px-8">
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
// REFACTOR: Updated to match Header component styling - full width navbar style