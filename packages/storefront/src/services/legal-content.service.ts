// REFACTOR: Centralized legal content service with caching and search functionality

import { LegalDocument, LegalDocumentType, LegalSearchResult, LegalNavigation } from '@/types/legal';

// OPTIMIZATION: In-memory cache for legal documents to reduce loading time
class LegalContentCache {
  private static instance: LegalContentCache;
  private cache = new Map<LegalDocumentType, { document: LegalDocument; timestamp: number }>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): LegalContentCache {
    if (!LegalContentCache.instance) {
      LegalContentCache.instance = new LegalContentCache();
    }
    return LegalContentCache.instance;
  }

  get(documentType: LegalDocumentType): LegalDocument | null {
    const cached = this.cache.get(documentType);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(documentType);
      return null;
    }
    
    return cached.document;
  }

  set(documentType: LegalDocumentType, document: LegalDocument): void {
    this.cache.set(documentType, { document, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

// OPTIMIZATION: Search index for fast content discovery
class LegalSearchIndex {
  private static instance: LegalSearchIndex;
  private searchIndex = new Map<string, LegalSearchResult[]>();

  static getInstance(): LegalSearchIndex {
    if (!LegalSearchIndex.instance) {
      LegalSearchIndex.instance = new LegalSearchIndex();
    }
    return LegalSearchIndex.instance;
  }

  buildIndex(documents: LegalDocument[]): void {
    this.searchIndex.clear();
    
    documents.forEach(document => {
      document.sections.forEach(section => {
        const words = this.tokenize(`${section.title} ${section.content}`);
        
        words.forEach(word => {
          const results = this.searchIndex.get(word) || [];
          results.push({
            documentId: document.id,
            documentTitle: document.title,
            sectionId: section.id,
            sectionTitle: section.title,
            matchedText: this.getContext(section.content, word),
            relevance: this.calculateRelevance(section.title, word)
          });
          this.searchIndex.set(word, results);
        });
      });
    });
  }

  search(query: string): LegalSearchResult[] {
    const words = this.tokenize(query);
    const results = new Map<string, LegalSearchResult>();
    
    words.forEach(word => {
      const matches = this.searchIndex.get(word.toLowerCase()) || [];
      matches.forEach(match => {
        const key = `${match.documentId}-${match.sectionId}`;
        const existing = results.get(key);
        if (!existing || match.relevance > existing.relevance) {
          results.set(key, match);
        }
      });
    });
    
    return Array.from(results.values()).sort((a, b) => b.relevance - a.relevance);
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  private getContext(content: string, word: string): string {
    const index = content.toLowerCase().indexOf(word.toLowerCase());
    if (index === -1) return content.substring(0, 100);
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 100);
    return content.substring(start, end);
  }

  private calculateRelevance(title: string, word: string): number {
    const titleMatch = title.toLowerCase().includes(word.toLowerCase()) ? 2 : 0;
    return titleMatch + 1;
  }
}

export class LegalContentService {
  private static instance: LegalContentService;
  private cache = LegalContentCache.getInstance();
  private searchIndex = LegalSearchIndex.getInstance();

  static getInstance(): LegalContentService {
    if (!LegalContentService.instance) {
      LegalContentService.instance = new LegalContentService();
    }
    return LegalContentService.instance;
  }

  // OPTIMIZATION: Async loading with caching for better performance
  async getDocument(documentType: LegalDocumentType): Promise<LegalDocument> {
    const cached = this.cache.get(documentType);
    if (cached) {
      return cached;
    }

    const document = await this.loadDocument(documentType);
    this.cache.set(documentType, document);
    return document;
  }

  async searchContent(query: string): Promise<LegalSearchResult[]> {
    const documents = await Promise.all([
      this.getDocument('privacy'),
      this.getDocument('terms'),
      this.getDocument('cookies')
    ]);
    
    this.searchIndex.buildIndex(documents);
    return this.searchIndex.search(query);
  }

  getNavigation(currentPage: string): LegalNavigation {
    return {
      currentPage,
      pages: [
        {
          id: 'privacy',
          title: 'Privacy Policy',
          path: '/privacy',
          description: 'How we collect, use, and protect your personal information'
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          path: '/terms',
          description: 'The legal agreement between you and Artisan Base'
        },
        {
          id: 'cookies',
          title: 'Cookie Policy',
          path: '/cookies',
          description: 'How we use cookies and similar technologies'
        }
      ]
    };
  }

  // REFACTOR: Separated content loading logic for better maintainability
  private async loadDocument(documentType: LegalDocumentType): Promise<LegalDocument> {
    switch (documentType) {
      case 'privacy':
        return this.getPrivacyPolicy();
      case 'terms':
        return this.getTermsOfService();
      case 'cookies':
        return this.getCookiePolicy();
      default:
        throw new Error(`Unknown document type: ${documentType}`);
    }
  }

  private getPrivacyPolicy(): LegalDocument {
    return {
      id: 'privacy',
      title: 'Privacy Policy',
      effectiveDate: '2024-01-01',
      lastUpdated: '2024-12-01',
      version: '2.0',
      summary: 'This Privacy Policy explains how Artisan Base collects, uses, and protects your personal information.',
      contactInfo: {
        email: 'privacy@artisanbase.com',
        phone: '+1 (555) 123-4567',
        address: '123 Artisan St, Craft City, CC 12345',
        website: 'https://artisanbase.com'
      },
      sections: [
        {
          id: 'information-collection',
          title: 'Information Collection',
          content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:

• Personal information (name, email address, phone number)
• Billing and shipping information
• Account credentials
• Communication preferences
• Product reviews and feedback

We also automatically collect certain information when you use our website, including:
• Device information (IP address, browser type, operating system)
• Usage data (pages visited, time spent, links clicked)
• Location information (if you enable location services)
• Cookies and similar tracking technologies`
        },
        {
          id: 'how-we-use-information',
          title: 'How We Use Information',
          content: `We use the information we collect to:

• Process and fulfill your orders
• Provide customer support and respond to inquiries
• Send order confirmations and shipping updates
• Improve our website and services
• Personalize your experience
• Send marketing communications (with your consent)
• Detect and prevent fraud
• Comply with legal obligations

We will only use your personal information for the purposes described in this policy or as otherwise disclosed to you.`
        },
        {
          id: 'information-sharing',
          title: 'Information Sharing',
          content: `We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:

• With your explicit consent
• To trusted service providers who assist us in operating our website and conducting business
• To comply with legal requirements or protect our rights
• In connection with a business transfer or merger

We require all third-party service providers to maintain the confidentiality and security of your information.`
        },
        {
          id: 'data-storage-security',
          title: 'Data Storage & Security',
          content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

• Encryption of sensitive data in transit and at rest
• Regular security assessments and updates
• Access controls and authentication procedures
• Employee training on data protection
• Incident response procedures

However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`
        },
        {
          id: 'user-rights',
          title: 'User Rights',
          content: `Depending on your location, you may have certain rights regarding your personal information:

• Access: Request a copy of the personal information we hold about you
• Correction: Request correction of inaccurate or incomplete information
• Deletion: Request deletion of your personal information
• Portability: Request transfer of your data to another service
• Restriction: Request limitation of how we process your information
• Objection: Object to certain types of processing
• Withdrawal of consent: Withdraw consent for marketing communications

To exercise these rights, please contact us using the information provided below.`
        },
        {
          id: 'cookies-tracking',
          title: 'Cookies & Tracking',
          content: `We use cookies and similar technologies to enhance your browsing experience and analyze website usage. These technologies help us:

• Remember your preferences and settings
• Provide personalized content and recommendations
• Analyze website traffic and performance
• Improve our services and user experience

You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.`
        },
        {
          id: 'third-party-services',
          title: 'Third-Party Services',
          content: `Our website may integrate with third-party services that collect information:

• Payment processors (Stripe, PayPal)
• Analytics services (Google Analytics)
• Social media platforms
• Advertising networks
• Customer support tools

These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of third-party services.`
        },
        {
          id: 'childrens-privacy',
          title: "Children's Privacy",
          content: `Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.

If you are between 13 and 16 years old, you may need parental consent to use certain features of our website, depending on your jurisdiction.`
        },
        {
          id: 'policy-changes',
          title: 'Changes to Policy',
          content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:

• Posting the updated policy on our website
• Sending an email notification
• Displaying a prominent notice on our website

The effective date at the top of this policy indicates when it was last updated. We encourage you to review this policy periodically.`
        },
        {
          id: 'contact-information',
          title: 'Contact Information',
          content: `If you have any questions about this Privacy Policy or our privacy practices, please contact us:

Email: privacy@artisanbase.com
Phone: +1 (555) 123-4567
Address: 123 Artisan St, Craft City, CC 12345
Website: https://artisanbase.com

We will respond to your inquiry within 30 days of receipt.`
        }
      ]
    };
  }

  private getTermsOfService(): LegalDocument {
    return {
      id: 'terms',
      title: 'Terms of Service',
      effectiveDate: '2024-01-01',
      lastUpdated: '2024-12-01',
      version: '2.0',
      summary: 'These Terms of Service govern your use of Artisan Base and establish the legal agreement between you and our company.',
      contactInfo: {
        email: 'legal@artisanbase.com',
        phone: '+1 (555) 123-4567',
        address: '123 Artisan St, Craft City, CC 12345',
        website: 'https://artisanbase.com'
      },
      sections: [
        {
          id: 'acceptance-terms',
          title: 'Acceptance of Terms',
          content: `By accessing or using Artisan Base, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this website.

These terms apply to all visitors, users, and others who access or use the service. Your continued use of the service following the posting of any changes to these terms constitutes acceptance of those changes.`
        },
        {
          id: 'service-description',
          title: 'Description of Service',
          content: `Artisan Base is an e-commerce platform that connects customers with talented artisans and crafters. Our service includes:

• Online marketplace for handcrafted products
• Secure payment processing
• Order management and tracking
• Customer support services
• Product reviews and ratings
• Shipping and delivery coordination

We reserve the right to modify, suspend, or discontinue any aspect of our service at any time with or without notice.`
        },
        {
          id: 'user-responsibilities',
          title: 'User Responsibilities',
          content: `As a user of Artisan Base, you agree to:

• Provide accurate and complete information
• Maintain the security of your account credentials
• Use the service only for lawful purposes
• Respect the intellectual property rights of others
• Not engage in fraudulent or deceptive practices
• Not interfere with the proper functioning of the website
• Not attempt to gain unauthorized access to our systems

Prohibited activities include:
• Creating fake accounts or providing false information
• Attempting to manipulate product reviews or ratings
• Engaging in price manipulation or market manipulation
• Violating any applicable laws or regulations
• Harassing or threatening other users or staff`
        },
        {
          id: 'intellectual-property',
          title: 'Intellectual Property',
          content: `The content on Artisan Base, including but not limited to text, graphics, images, logos, and software, is owned by Artisan Base or its licensors and is protected by copyright, trademark, and other intellectual property laws.

You may not:
• Copy, reproduce, or distribute our content without permission
• Use our trademarks or logos without written consent
• Create derivative works based on our content
• Remove or alter any copyright or trademark notices

Product images and descriptions provided by artisans remain their intellectual property, and we respect their rights accordingly.`
        },
        {
          id: 'user-generated-content',
          title: 'User-Generated Content',
          content: `When you submit content to Artisan Base (reviews, comments, photos, etc.), you grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute that content in connection with our service.

You represent and warrant that:
• You own or have the right to use the content you submit
• Your content does not violate any third-party rights
• Your content is accurate and not misleading
• Your content complies with our community guidelines

We reserve the right to remove or modify user-generated content that violates these terms or our policies.`
        },
        {
          id: 'account-terms',
          title: 'Account Terms',
          content: `To use certain features of Artisan Base, you must create an account. You are responsible for:

• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized use
• Ensuring your account information is accurate and up-to-date

We reserve the right to:
• Suspend or terminate accounts that violate these terms
• Require additional verification for account security
• Limit account access for suspicious activity
• Delete inactive accounts after a reasonable period`
        },
        {
          id: 'payment-terms',
          title: 'Payment Terms',
          content: `All purchases on Artisan Base are subject to the following payment terms:

• Prices are listed in USD unless otherwise specified
• Payment is processed securely through our payment partners
• Sales tax will be added where applicable
• Orders are not confirmed until payment is received
• Refunds are processed according to our return policy

We use industry-standard security measures to protect your payment information. We do not store your complete payment card details on our servers.`
        },
        {
          id: 'disclaimers',
          title: 'Disclaimers',
          content: `Artisan Base is provided "as is" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to:

• Warranties of merchantability and fitness for a particular purpose
• Warranties that the service will be uninterrupted or error-free
• Warranties regarding the accuracy or completeness of information
• Warranties regarding third-party products or services

We do not guarantee that the service will meet your specific requirements or that any errors will be corrected.`
        },
        {
          id: 'limitation-liability',
          title: 'Limitation of Liability',
          content: `In no event shall Artisan Base be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:

• Loss of profits, data, or use
• Business interruption
• Personal injury or property damage
• Emotional distress

Our total liability to you for any claims arising from your use of the service shall not exceed the amount you paid to us in the 12 months preceding the claim.`
        },
        {
          id: 'indemnification',
          title: 'Indemnification',
          content: `You agree to indemnify and hold harmless Artisan Base, its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from:

• Your use of the service
• Your violation of these terms
• Your violation of any third-party rights
• Your violation of any applicable laws or regulations

This indemnification obligation will survive the termination of these terms and your use of the service.`
        },
        {
          id: 'termination',
          title: 'Termination',
          content: `We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including but not limited to:

• Violation of these terms
• Fraudulent or illegal activity
• Extended periods of inactivity
• At your request

Upon termination:
• Your right to use the service ceases immediately
• We may delete your account and data
• Any outstanding obligations remain your responsibility
• These terms continue to apply to any disputes arising before termination`
        },
        {
          id: 'governing-law',
          title: 'Governing Law',
          content: `These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.

Any disputes arising from these terms or your use of the service shall be resolved in the courts of California, and you consent to the personal jurisdiction of such courts.`
        },
        {
          id: 'dispute-resolution',
          title: 'Dispute Resolution',
          content: `Before pursuing formal legal action, we encourage you to contact us directly to resolve any disputes. If we cannot resolve the dispute informally, the following procedures apply:

• Small claims court for disputes under $10,000
• Binding arbitration for larger disputes
• Class action waivers
• 30-day notice period before legal action

Arbitration will be conducted by a neutral arbitrator in accordance with the rules of the American Arbitration Association.`
        },
        {
          id: 'changes-terms',
          title: 'Changes to Terms',
          content: `We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on our website. We will notify users of material changes by:

• Posting a notice on our website
• Sending an email notification
• Displaying a prominent banner

Your continued use of the service after changes are posted constitutes acceptance of the new terms. If you do not agree to the changes, you must stop using the service.`
        },
        {
          id: 'contact-information',
          title: 'Contact Information',
          content: `If you have any questions about these Terms of Service, please contact us:

Email: legal@artisanbase.com
Phone: +1 (555) 123-4567
Address: 123 Artisan St, Craft City, CC 12345
Website: https://artisanbase.com

We will respond to your inquiry within 30 days of receipt.`
        }
      ]
    };
  }

  private getCookiePolicy(): LegalDocument {
    return {
      id: 'cookies',
      title: 'Cookie Policy',
      effectiveDate: '2024-01-01',
      lastUpdated: '2024-12-01',
      version: '2.0',
      summary: 'This Cookie Policy explains how Artisan Base uses cookies and similar technologies to enhance your browsing experience.',
      contactInfo: {
        email: 'privacy@artisanbase.com',
        phone: '+1 (555) 123-4567',
        address: '123 Artisan St, Craft City, CC 12345',
        website: 'https://artisanbase.com'
      },
      sections: [
        {
          id: 'what-are-cookies',
          title: 'What Are Cookies',
          content: `Cookies are small text files that are stored on your device when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings.

Cookies can make your next visit easier and the site more useful to you. They play an important role in making websites work efficiently and providing information to website owners.

There are several types of cookies:
• Session cookies: Temporary cookies that expire when you close your browser
• Persistent cookies: Cookies that remain on your device for a set period
• First-party cookies: Cookies set by the website you're visiting
• Third-party cookies: Cookies set by external services or advertisers`
        },
        {
          id: 'types-cookies-used',
          title: 'Types of Cookies We Use',
          content: `We use several types of cookies on Artisan Base:

Essential Cookies:
• Authentication cookies to keep you logged in
• Shopping cart cookies to remember your items
• Security cookies to protect against fraud

Functional Cookies:
• Language and region preferences
• User interface customization
• Form auto-fill data

Analytics Cookies:
• Website usage statistics
• Performance monitoring
• User behavior analysis

Marketing Cookies:
• Personalized advertising
• Social media integration
• Email marketing tracking`
        },
        {
          id: 'cookie-categories',
          title: 'Cookie Categories',
          content: `We categorize our cookies based on their purpose and function:

Strictly Necessary Cookies:
These cookies are essential for the website to function properly. They enable basic functions like page navigation, access to secure areas, and shopping cart functionality. The website cannot function properly without these cookies.

Performance/Analytics Cookies:
These cookies collect information about how visitors use our website, such as which pages are visited most often and if users get error messages. This information is used to improve website performance and user experience.

Functionality Cookies:
These cookies allow the website to remember choices you make and provide enhanced, more personal features. They may be set by us or by third-party providers whose services we have added to our pages.

Targeting/Advertising Cookies:
These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.`
        },
        {
          id: 'third-party-cookies',
          title: 'Third-Party Cookies',
          content: `Our website may use cookies from third-party services, including:

Google Analytics:
• _ga, _gid, _gat cookies for website analytics
• Used to understand how visitors interact with our website
• Data is anonymized and aggregated

Social Media Platforms:
• Facebook, Twitter, Instagram cookies for social sharing
• Used to enable social media integration
• May track your activity across websites

Advertising Networks:
• Google Ads, Facebook Ads cookies for targeted advertising
• Used to show relevant advertisements
• May track your browsing behavior

Payment Processors:
• Stripe, PayPal cookies for payment processing
• Used to secure payment transactions
• May store payment preferences

These third-party services have their own privacy policies and cookie practices.`
        },
        {
          id: 'cookie-duration',
          title: 'Cookie Duration',
          content: `Cookies on our website have different lifespans:

Session Cookies:
• Expire when you close your browser
• Used for temporary data like shopping cart items
• Automatically deleted when browser session ends

Short-term Cookies:
• Expire within 24 hours to 30 days
• Used for user preferences and temporary settings
• Examples: language preferences, recent searches

Long-term Cookies:
• Expire after 1-2 years
• Used for analytics and marketing purposes
• Examples: user behavior tracking, advertising preferences

Persistent Cookies:
• Remain until manually deleted
• Used for essential functions like authentication
• Examples: login status, security tokens

We regularly review and update our cookie settings to ensure they align with our privacy commitments.`
        },
        {
          id: 'managing-cookies',
          title: 'Managing Cookies',
          content: `You have several options for managing cookies:

Browser Settings:
• Most browsers allow you to control cookies through settings
• You can block all cookies or only third-party cookies
• You can delete existing cookies
• You can set preferences for different websites

Cookie Consent:
• We provide a cookie consent banner when you first visit
• You can change your preferences at any time
• Essential cookies cannot be disabled as they're required for functionality

Opt-out Tools:
• Google Analytics opt-out browser add-on
• Digital Advertising Alliance opt-out tool
• Network Advertising Initiative opt-out tool

Mobile Devices:
• iOS: Settings > Safari > Privacy & Security
• Android: Chrome > Settings > Privacy and security
• App-specific settings may also be available

Please note that disabling certain cookies may affect website functionality.`
        },
        {
          id: 'cookie-consent',
          title: 'Cookie Consent',
          content: `We obtain your consent for non-essential cookies through our cookie consent mechanism:

Consent Banner:
• Appears when you first visit our website
• Clearly explains what cookies we use and why
• Allows you to accept or decline non-essential cookies
• Provides links to this policy for more information

Consent Management:
• You can change your preferences at any time
• We remember your choices for future visits
• You can withdraw consent by clearing cookies
• We provide easy access to cookie settings

Granular Control:
• Accept or decline cookies by category
• Essential cookies are always enabled
• You can change preferences for specific cookie types
• We respect your choices across all pages

We do not use cookies that require consent until you have given your permission.`
        },
        {
          id: 'similar-technologies',
          title: 'Similar Technologies',
          content: `In addition to cookies, we may use similar technologies:

Web Beacons:
• Small transparent images embedded in emails or web pages
• Used to track email opens and page views
• Help us understand user engagement

Local Storage:
• Data stored in your browser's local storage
• Used for user preferences and settings
• Persists even after browser is closed

Session Storage:
• Temporary data storage during browser session
• Used for form data and temporary preferences
• Cleared when browser session ends

Fingerprinting:
• Technology that identifies devices based on characteristics
• Used for fraud prevention and security
• May be used in combination with cookies

These technologies work together to provide a better user experience and help us improve our services.`
        },
        {
          id: 'updates-policy',
          title: 'Updates to This Policy',
          content: `We may update this Cookie Policy from time to time to reflect:

• Changes in our cookie practices
• New technologies or services
• Legal or regulatory requirements
• User feedback and preferences

When we make changes:
• We will update the "Last Updated" date
• We will notify users of significant changes
• We will provide clear information about what changed
• We will obtain new consent if required

We encourage you to review this policy periodically to stay informed about how we use cookies and similar technologies.`
        },
        {
          id: 'contact-information',
          title: 'Contact Information',
          content: `If you have any questions about our use of cookies or this Cookie Policy, please contact us:

Email: privacy@artisanbase.com
Phone: +1 (555) 123-4567
Address: 123 Artisan St, Craft City, CC 12345
Website: https://artisanbase.com

For technical support with cookie management:
• Check your browser's help documentation
• Contact your browser's support team
• Use our cookie preference center

We will respond to your inquiry within 30 days of receipt.`
        }
      ]
    };
  }
} 