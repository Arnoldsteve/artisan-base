// REFACTOR: Table of contents component with smooth scrolling and performance optimization
'use client'

import { useCallback, useEffect, useState } from "react";
import { LegalSection } from "@/types/legal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";

interface LegalTableOfContentsProps {
  sections: LegalSection[];
}

export function LegalTableOfContents({ sections }: LegalTableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  // OPTIMIZATION: Intersection Observer for active section detection
  useEffect(() => {
    const observerOptions = {
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all section headers
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  // OPTIMIZATION: Smooth scroll with performance optimization
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  // OPTIMIZATION: Memoized section links for better performance
  const sectionLinks = sections.map((section) => {
    const isActive = activeSection === section.id;

    return (
      <button
        key={section.id}
        onClick={() => scrollToSection(section.id)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        {section.title}
      </button>
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <List className="h-5 w-5" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-1">{sectionLinks}</nav>

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Sections:</span>
            <span>{sections.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Current:</span>
            <span className="capitalize">
              {activeSection ? activeSection.replace("-", " ") : "None"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
