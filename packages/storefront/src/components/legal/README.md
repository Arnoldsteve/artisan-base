# Legal Pages Implementation

## Overview

This directory contains a comprehensive legal pages system for the Artisan Base storefront, implementing Privacy Policy, Terms of Service, and Cookie Policy pages with advanced search functionality.

## Architecture

### Core Principles

1. **SOLID Principles**: Each component has a single responsibility
2. **DRY (Don't Repeat Yourself)**: Reusable components and services
3. **Performance Optimization**: Caching, debounced search, and efficient rendering
4. **Accessibility**: WCAG compliant with proper semantic markup
5. **SEO Optimized**: Proper metadata and structured content

### File Structure

```
legal/
├── index.ts                           # Clean exports
├── legal-document-layout.tsx          # Main layout wrapper
├── legal-document-content.tsx         # Content renderer
├── legal-navigation.tsx               # Sidebar navigation
├── legal-search.tsx                   # Search functionality
├── legal-table-of-contents.tsx        # TOC with smooth scrolling
├── legal-footer.tsx                   # Contact information
└── README.md                          # This documentation
```

## Components

### LegalDocumentLayout

- **Purpose**: Main layout wrapper for all legal pages
- **Features**:
  - Print, download, and share functionality
  - Responsive sidebar layout
  - SEO metadata integration
- **Performance**: Memoized action handlers

### LegalDocumentContent

- **Purpose**: Renders legal document sections
- **Features**:
  - Automatic paragraph and bullet point parsing
  - Proper heading hierarchy
  - Print-friendly formatting
- **Performance**: Optimized rendering with proper key usage

### LegalNavigation

- **Purpose**: Sidebar navigation between legal pages
- **Features**:
  - Active state management
  - Icon mapping for visual clarity
  - Responsive design
- **Performance**: Efficient icon mapping and state updates

### LegalSearch

- **Purpose**: Search functionality with debouncing
- **Features**:
  - 300ms debounced search
  - Real-time results display
  - Search tips and guidance
- **Performance**: Debounced API calls and memoized results

### LegalTableOfContents

- **Purpose**: Table of contents with smooth scrolling
- **Features**:
  - Intersection Observer for active section detection
  - Smooth scrolling to sections
  - Progress tracking
- **Performance**: Efficient scroll handling and state management

### LegalFooter

- **Purpose**: Contact information and support access
- **Features**:
  - Multiple contact methods
  - Quick action buttons
  - Detailed guidance for different inquiry types
- **Performance**: Optimized click handlers

## Services

### LegalContentService

- **Purpose**: Centralized content management
- **Features**:
  - Singleton pattern for caching
  - In-memory document cache (24-hour TTL)
  - Search index building
  - Navigation management
- **Performance**:
  - O(1) cache lookups
  - Efficient search indexing
  - Lazy loading of documents

### LegalSearchIndex

- **Purpose**: Fast content search
- **Features**:
  - Tokenized search
  - Relevance scoring
  - Context extraction
- **Performance**:
  - O(log n) search complexity
  - Efficient tokenization
  - Relevance-based sorting

## Performance Optimizations

### Caching Strategy

- **Document Cache**: 24-hour TTL for legal documents
- **Search Index**: Built on-demand and cached
- **Component Memoization**: Prevents unnecessary re-renders

### Search Optimization

- **Debouncing**: 300ms delay to reduce API calls
- **Tokenization**: Efficient word processing
- **Relevance Scoring**: Smart result ranking

### Rendering Optimization

- **Lazy Loading**: Components load on demand
- **Suspense Boundaries**: Proper loading states
- **Efficient DOM Updates**: Minimal re-renders

## Accessibility Features

### WCAG Compliance

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant

### Print Accessibility

- **Print Styles**: Optimized for printing
- **Page Breaks**: Proper section breaks
- **High Contrast**: Black text on white background

## SEO Features

### Metadata

- **Dynamic Titles**: Page-specific titles
- **Meta Descriptions**: Comprehensive descriptions
- **Keywords**: Relevant legal terms
- **Structured Data**: Schema markup ready

### Content Structure

- **Heading Hierarchy**: Proper H1-H6 structure
- **Internal Linking**: Cross-references between sections
- **URL Structure**: Clean, semantic URLs

## Usage Examples

### Basic Legal Page

```tsx
import { LegalDocumentLayout, LegalDocumentContent } from "@/components/legal";
import { LegalContentService } from "@/services/legal-content.service";

async function PrivacyPolicyPage() {
  const legalService = LegalContentService.getInstance();
  const document = await legalService.getDocument("privacy");
  const navigation = legalService.getNavigation("privacy");

  return (
    <LegalDocumentLayout document={document} navigation={navigation}>
      <LegalDocumentContent sections={document.sections} />
    </LegalDocumentLayout>
  );
}
```

### Search Integration

```tsx
import { LegalSearch } from "@/components/legal";

function SearchComponent() {
  const handleSearch = async (query: string) => {
    const results = await legalService.searchContent(query);
    // Handle results
  };

  return <LegalSearch onSearch={handleSearch} />;
}
```

## Maintenance

### Content Updates

1. Update content in `LegalContentService`
2. Clear cache if needed: `legalService.cache.clear()`
3. Test search functionality
4. Verify print layout

### Adding New Legal Documents

1. Add document type to `LegalDocumentType`
2. Implement content method in service
3. Add navigation entry
4. Create page component
5. Update search index

### Performance Monitoring

- Monitor cache hit rates
- Track search performance
- Measure page load times
- Check print functionality

## Future Enhancements

### Planned Features

- **Multi-language Support**: International legal compliance
- **Version History**: Track policy changes
- **User Consent Tracking**: GDPR compliance tools
- **Advanced Search**: Filters and saved searches
- **PDF Export**: High-quality document export

### Technical Improvements

- **Service Worker**: Offline document access
- **Progressive Web App**: App-like experience
- **Analytics Integration**: Usage tracking
- **A/B Testing**: Content optimization

## Troubleshooting

### Common Issues

**Search Not Working**

- Check if documents are loaded in cache
- Verify search index is built
- Check console for errors

**Print Layout Issues**

- Verify print CSS is loaded
- Check for conflicting styles
- Test in different browsers

**Performance Issues**

- Clear cache if needed
- Check for memory leaks
- Monitor bundle size

### Debug Mode

Enable debug logging by setting:

```typescript
localStorage.setItem("legal-debug", "true");
```

## Contributing

When contributing to legal pages:

1. **Follow SOLID Principles**: Keep components focused
2. **Optimize Performance**: Use caching and memoization
3. **Maintain Accessibility**: Test with screen readers
4. **Update Documentation**: Keep this README current
5. **Test Thoroughly**: Verify all functionality works

## Legal Compliance

This implementation supports:

- **GDPR**: European data protection
- **CCPA**: California privacy rights
- **COPPA**: Children's online privacy
- **Industry Standards**: E-commerce best practices

Always consult with legal professionals when updating content or adding new legal features.
