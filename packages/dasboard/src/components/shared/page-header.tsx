
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; 
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {/* The action button(s) will be rendered here */}
      {children && <div>{children}</div>}
    </div>
  );
}