// REFACTOR: Legal document content component with optimized rendering and accessibility

import { LegalSection } from "@/types/legal";
import { Separator } from "@/components/ui/separator";

interface LegalDocumentContentProps {
  sections: LegalSection[];
}

export function LegalDocumentContent({ sections }: LegalDocumentContentProps) {
  // OPTIMIZATION: Memoized section rendering for better performance
  const renderSection = (section: LegalSection, index: number) => {
    const isLast = index === sections.length - 1;

    return (
      <section key={section.id} id={section.id} className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4 scroll-mt-20">
          {section.title}
        </h2>

        <div className="prose prose-gray max-w-none">
          {/* OPTIMIZATION: Split content into paragraphs for better readability */}
          {section.content.split("\n\n").map((paragraph, pIndex) => {
            if (paragraph.trim() === "") return null;

            // Check if paragraph starts with bullet points
            if (paragraph.includes("•")) {
              const lines = paragraph.split("\n");
              const title = lines[0];
              const bulletPoints = lines
                .slice(1)
                .filter((line) => line.trim().startsWith("•"));

              return (
                <div key={pIndex} className="mb-4">
                  {title && <p className="mb-2">{title}</p>}
                  {bulletPoints.length > 0 && (
                    <ul className="list-disc pl-6 space-y-1">
                      {bulletPoints.map((point, bIndex) => (
                        <li key={bIndex} className="text-muted-foreground">
                          {point.replace("•", "").trim()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }

            // Regular paragraph
            return (
              <p
                key={pIndex}
                className="text-muted-foreground leading-relaxed mb-4"
              >
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Subsections */}
        {section.subsections && section.subsections.length > 0 && (
          <div className="mt-6 space-y-4">
            {section.subsections.map((subsection) => (
              <div key={subsection.id} id={subsection.id} className="ml-4">
                <h3 className="text-lg font-medium text-foreground mb-2 scroll-mt-20">
                  {subsection.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {subsection.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Separator between sections */}
        {!isLast && <Separator className="mt-8" />}
      </section>
    );
  };

  return (
    <div className="space-y-8">
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );
}
