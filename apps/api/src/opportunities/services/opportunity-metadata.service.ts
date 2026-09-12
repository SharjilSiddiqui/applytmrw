import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';

export interface ExtractedOpportunityMetadata {
  title?: string;
  company?: string;
  description?: string;
}

@Injectable()
export class OpportunityMetadataService {
  private readonly logger = new Logger(OpportunityMetadataService.name);

  async extract(url: string): Promise<ExtractedOpportunityMetadata> {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/120.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        this.logger.warn(`Failed to fetch opportunity URL: ${response.status}`);

        return this.extractFromUrl(url);
      }

      const html = await response.text();

      this.logger.debug(`Response URL: ${response.url}`);

      this.logger.debug(
        `Content-Type: ${response.headers.get('content-type')}`,
      );

      /*
       * Platform-specific extraction should happen first.
       *
       * Some job platforms do not provide reliable Open Graph metadata,
       * so generic extraction alone is not enough.
       */

      if (this.isLinkedInUrl(url)) {
        const metadata = this.extractLinkedInFromHtml(html, url);

        if (this.hasUsefulMetadata(metadata)) {
          return metadata;
        }
      }

      if (this.isNaukriUrl(url)) {
        const metadata = this.extractNaukriMetadata(html, url);

        if (this.hasUsefulMetadata(metadata)) {
          return metadata;
        }
      }

      /*
       * Generic extraction for all other websites.
       */

      const metadata = this.extractFromHtml(html, url);

      /*
       * If the HTML extraction did not find anything useful,
       * use the URL as the final fallback.
       */

      if (!this.hasUsefulMetadata(metadata)) {
        return this.extractFromUrl(url);
      }

      return metadata;
    } catch (error) {
      this.logger.warn(
        `Failed to extract metadata from ${url}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );

      /*
       * Even if fetching fails, we can sometimes extract useful
       * information from the URL itself.
       */

      return this.extractFromUrl(url);
    }
  }

  /*
   * ============================================================
   * GENERIC HTML EXTRACTION
   * ============================================================
   */

  private extractFromHtml(
    html: string,
    url: string,
  ): ExtractedOpportunityMetadata {
    const $ = cheerio.load(html);

    const rawTitle =
      this.getMeta($, 'meta[property="og:title"]') ??
      this.getMeta($, 'meta[name="twitter:title"]') ??
      this.getMeta($, 'meta[name="title"]') ??
      this.cleanText($('title').first().text());

    const description =
      this.getMeta($, 'meta[property="og:description"]') ??
      this.getMeta($, 'meta[name="description"]') ??
      this.getMeta($, 'meta[name="twitter:description"]');

    const company = this.extractCompany($, url);

    return {
      ...(rawTitle && {
        title: this.cleanGenericTitle(rawTitle),
      }),

      ...(company && {
        company: this.cleanText(company),
      }),

      ...(description && {
        description: this.cleanText(description),
      }),
    };
  }

  /*
   * ============================================================
   * LINKEDIN
   * ============================================================
   */

  private extractLinkedInFromHtml(
    html: string,
    url: string,
  ): ExtractedOpportunityMetadata {
    const $ = cheerio.load(html);

    const rawTitle =
      this.getMeta($, 'meta[property="og:title"]') ??
      this.getMeta($, 'meta[name="twitter:title"]') ??
      this.cleanText($('title').first().text());

    const description =
      this.getMeta($, 'meta[property="og:description"]') ??
      this.getMeta($, 'meta[name="description"]') ??
      this.getMeta($, 'meta[name="twitter:description"]');

    return this.extractLinkedInMetadata(rawTitle, description);
  }

  private extractLinkedInMetadata(
    rawTitle?: string,
    description?: string,
  ): ExtractedOpportunityMetadata {
    const cleanedTitle = this.cleanText(rawTitle);
    const cleanedDescription = this.cleanText(description);

    if (!cleanedTitle) {
      return {
        ...(cleanedDescription && {
          description: cleanedDescription,
        }),
      };
    }

    /*
     * Example:
     *
     * "Script Assist hiring Technical Support Engineer –
     * EHR / EMR Application Support in India | LinkedIn"
     */

    const hiringMatch = cleanedTitle.match(
      /^(.+?)\s+hiring\s+(.+?)(?:\s+in\s+.+?)?\s*(?:\|\s*LinkedIn.*)?$/i,
    );

    if (hiringMatch?.[1] && hiringMatch?.[2]) {
      return {
        company: this.cleanText(hiringMatch[1]),
        title: this.cleanText(hiringMatch[2]),

        ...(cleanedDescription && {
          description: cleanedDescription,
        }),
      };
    }

    /*
     * Example:
     *
     * "Software Engineer at Example Company — Bengaluru | LinkedIn"
     */

    const atMatch = cleanedTitle.match(
      /^(.+?)\s+at\s+(.+?)(?:\s+—\s+.+?)?(?:\s*\|\s*LinkedIn.*)?$/i,
    );

    if (atMatch?.[1] && atMatch?.[2]) {
      return {
        title: this.cleanText(atMatch[1]),
        company: this.cleanText(atMatch[2]),

        ...(cleanedDescription && {
          description: cleanedDescription,
        }),
      };
    }

    return {
      ...(this.cleanLinkedInTitle(cleanedTitle) && {
        title: this.cleanLinkedInTitle(cleanedTitle),
      }),

      ...(this.extractLinkedInCompany(cleanedTitle) && {
        company:
          this.extractLinkedInCompany(cleanedTitle) ??
          this.extractCompanyFromDescription(cleanedDescription),
      }),

      ...(cleanedDescription && {
        description: cleanedDescription,
      }),
    };
  }

  private cleanLinkedInTitle(rawTitle?: string): string | undefined {
    if (!rawTitle) {
      return undefined;
    }

    let title = rawTitle;

    title = title.replace(/\s*\|\s*LinkedIn Jobs.*$/i, '');

    title = title.replace(/\s*\|\s*LinkedIn.*$/i, '');

    title = title.replace(/\s+at\s+.+?(?:\s+—\s+.+)?$/i, '');

    title = title.replace(/\s+—\s+.+$/i, '');

    return this.cleanText(title);
  }

  private extractLinkedInCompany(rawTitle?: string): string | undefined {
    if (!rawTitle) {
      return undefined;
    }

    const match = rawTitle.match(
      /\s+at\s+(.+?)(?:\s+—\s+.+?)?(?:\s*\|\s*LinkedIn.*)?$/i,
    );

    return match?.[1] ? this.cleanText(match[1]) : undefined;
  }

  /*
   * ============================================================
   * NAUKRI
   * ============================================================
   */

  private extractNaukriMetadata(
    html: string,
    url: string,
  ): ExtractedOpportunityMetadata {
    const $ = cheerio.load(html);

    /*
     * ----------------------------------------------------------
     * 1. Try JSON-LD
     * ----------------------------------------------------------
     *
     * JobPosting structured data is the cleanest source when
     * it is available.
     */

    const jsonLdMetadata = this.extractJobPostingJsonLd($);

    if (this.hasUsefulMetadata(jsonLdMetadata)) {
      return jsonLdMetadata;
    }

    /*
     * ----------------------------------------------------------
     * 2. Try Naukri / Next.js page data
     * ----------------------------------------------------------
     */

    const nextDataMetadata = this.extractNaukriNextData(html);

    if (this.hasUsefulMetadata(nextDataMetadata)) {
      return nextDataMetadata;
    }

    /*
     * ----------------------------------------------------------
     * 3. Try common HTML elements
     * ----------------------------------------------------------
     */

    const htmlMetadata = this.extractNaukriFromHtml($);

    if (this.hasUsefulMetadata(htmlMetadata)) {
      return htmlMetadata;
    }

    /*
     * ----------------------------------------------------------
     * 4. Parse URL slug
     * ----------------------------------------------------------
     *
     * Example:
     *
     * /job-listings-platform-engineering-intern-
     * proarch-technology-services-remote-1-to-2-years...
     *
     * This is not perfect, but it is useful as a fallback.
     */

    return this.extractNaukriFromUrl(url);
  }

  private extractNaukriFromHtml(
    $: cheerio.CheerioAPI,
  ): ExtractedOpportunityMetadata {
    /*
     * These selectors are intentionally broad because
     * Naukri's page structure can vary.
     */

    const title =
      this.cleanText($('h1').first().text()) ??
      this.cleanText($('[class*="jobTitle"]').first().text()) ??
      this.cleanText($('[class*="job-title"]').first().text()) ??
      this.cleanText($('[class*="title"]').first().text());

    const company =
      this.cleanText($('[class*="companyName"]').first().text()) ??
      this.cleanText($('[class*="company-name"]').first().text()) ??
      this.cleanText($('[class*="company"]').first().text());

    const description =
      this.cleanText($('[class*="jobDescription"]').first().text()) ??
      this.cleanText($('[class*="job-description"]').first().text());

    return {
      ...(title && {
        title,
      }),

      ...(company && {
        company,
      }),

      ...(description && {
        description,
      }),
    };
  }

  /*
   * ============================================================
   * JSON-LD JOB POSTING EXTRACTION
   * ============================================================
   */

  private extractJobPostingJsonLd(
    $: cheerio.CheerioAPI,
  ): ExtractedOpportunityMetadata {
    const scripts = $('script[type="application/ld+json"]');

    for (let index = 0; index < scripts.length; index += 1) {
      const rawJson = $(scripts[index]).contents().text();

      if (!rawJson) {
        continue;
      }

      try {
        const parsed = JSON.parse(rawJson);

        const jobPosting = this.findJobPosting(parsed);

        if (!jobPosting) {
          continue;
        }

        const title = this.cleanText(jobPosting.title);

        const company =
          this.cleanText(jobPosting.hiringOrganization?.name) ??
          this.cleanText(jobPosting.hiringOrganization);

        const description = this.cleanText(
          this.stripHtml(jobPosting.description),
        );

        const metadata: ExtractedOpportunityMetadata = {
          ...(title && {
            title,
          }),

          ...(company && {
            company,
          }),

          ...(description && {
            description,
          }),
        };

        if (this.hasUsefulMetadata(metadata)) {
          return metadata;
        }
      } catch {
        /*
         * Ignore invalid JSON-LD blocks and continue.
         */
      }
    }

    return {};
  }

  private findJobPosting(value: unknown): Record<string, any> | undefined {
    if (!value) {
      return undefined;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const result = this.findJobPosting(item);

        if (result) {
          return result;
        }
      }

      return undefined;
    }

    if (typeof value !== 'object') {
      return undefined;
    }

    const object = value as Record<string, any>;

    const type = object['@type'];

    if (
      type === 'JobPosting' ||
      (Array.isArray(type) && type.includes('JobPosting'))
    ) {
      return object;
    }

    if (Array.isArray(object['@graph'])) {
      return this.findJobPosting(object['@graph']);
    }

    return undefined;
  }

  /*
   * ============================================================
   * NEXT.JS DATA EXTRACTION
   * ============================================================
   */

  private extractNaukriNextData(html: string): ExtractedOpportunityMetadata {
    /*
     * Try __NEXT_DATA__ first.
     */

    const nextDataMatch = html.match(
      /<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i,
    );

    if (nextDataMatch?.[1]) {
      try {
        const data = JSON.parse(nextDataMatch[1]);

        const result = this.searchObjectForJobData(data);

        if (this.hasUsefulMetadata(result)) {
          return result;
        }
      } catch {
        /*
         * Ignore invalid Next.js data.
         */
      }
    }

    /*
     * Some Next.js applications use self.__next_f.push(...)
     *
     * Instead of trying to reconstruct the complete React Flight
     * protocol, search the HTML for likely job data patterns.
     */

    return this.extractEmbeddedJobData(html);
  }

  private extractEmbeddedJobData(html: string): ExtractedOpportunityMetadata {
    const titlePatterns = [
      /"jobTitle"\s*:\s*"([^"]+)"/i,
      /"title"\s*:\s*"([^"]{3,150})"/i,
      /"job_title"\s*:\s*"([^"]+)"/i,
    ];

    const companyPatterns = [
      /"companyName"\s*:\s*"([^"]+)"/i,
      /"company_name"\s*:\s*"([^"]+)"/i,
      /"company"\s*:\s*"([^"]{2,100})"/i,
    ];

    const descriptionPatterns = [
      /"jobDescription"\s*:\s*"([^"]+)"/i,
      /"description"\s*:\s*"([^"]{20,1000})"/i,
    ];

    const title = this.findFirstPattern(html, titlePatterns);

    const company = this.findFirstPattern(html, companyPatterns);

    const description = this.findFirstPattern(html, descriptionPatterns);

    return {
      ...(title && {
        title: this.cleanEmbeddedText(title),
      }),

      ...(company && {
        company: this.cleanEmbeddedText(company),
      }),

      ...(description && {
        description: this.cleanEmbeddedText(description),
      }),
    };
  }

  private searchObjectForJobData(value: unknown): ExtractedOpportunityMetadata {
    const visited = new Set<unknown>();

    return this.searchObjectRecursively(value, visited, 0);
  }

  private searchObjectRecursively(
    value: unknown,
    visited: Set<unknown>,
    depth: number,
  ): ExtractedOpportunityMetadata {
    if (!value || depth > 12) {
      return {};
    }

    if (typeof value !== 'object') {
      return {};
    }

    if (visited.has(value)) {
      return {};
    }

    visited.add(value);

    if (Array.isArray(value)) {
      for (const item of value) {
        const result = this.searchObjectRecursively(item, visited, depth + 1);

        if (this.hasUsefulMetadata(result)) {
          return result;
        }
      }

      return {};
    }

    const object = value as Record<string, any>;

    /*
     * Look for common job field names.
     */

    const title =
      this.cleanText(object.jobTitle) ??
      this.cleanText(object.title) ??
      this.cleanText(object.job_title);

    const company =
      this.cleanText(object.companyName) ??
      this.cleanText(object.company_name) ??
      this.cleanText(object.company?.name);

    const description =
      this.cleanText(this.stripHtml(object.jobDescription)) ??
      this.cleanText(this.stripHtml(object.description));

    /*
     * Only accept this object if it actually looks
     * like a job object.
     */

    if (title && (company || description)) {
      return {
        title,
        ...(company && {
          company,
        }),
        ...(description && {
          description,
        }),
      };
    }

    /*
     * Continue recursively.
     */

    for (const child of Object.values(object)) {
      const result = this.searchObjectRecursively(child, visited, depth + 1);

      if (this.hasUsefulMetadata(result)) {
        return result;
      }
    }

    return {};
  }

  /*
   * ============================================================
   * NAUKRI URL FALLBACK
   * ============================================================
   */

  private extractNaukriFromUrl(url: string): ExtractedOpportunityMetadata {
    try {
      const parsedUrl = new URL(url);

      const pathname = decodeURIComponent(parsedUrl.pathname);

      /*
       * Example:
       *
       * /job-listings-platform-engineering-intern-
       * proarch-technology-services-remote-1-to-2-years-0709256032
       */

      const match = pathname.match(/job-listings-([^/?]+)/i);

      if (!match?.[1]) {
        return {};
      }

      let slug = match[1];

      /*
       * Remove numeric job identifiers.
       */

      slug = slug.replace(/-\d{8,}$/i, '');

      /*
       * Convert the slug into readable words.
       */

      const readable = slug.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();

      if (!readable) {
        return {};
      }

      /*
       * Remove common location / experience suffixes.
       */

      const cleanedReadable = readable
        .replace(/\s+(remote|hybrid|work from home|wfh)\b.*$/i, '')
        .replace(/\s+\d+\s+to\s+\d+\s+years?.*$/i, '')
        .replace(/\s+\d+\+?\s+years?.*$/i, '')
        .trim();

      /*
       * Attempt to split:
       *
       * "Platform Engineering Intern Proarch Technology Services"
       *
       * into:
       *
       * title   = Platform Engineering Intern
       * company = Proarch Technology Services
       *
       * We do this using known company suffixes and a heuristic.
       */

      const split = this.splitNaukriTitleAndCompany(cleanedReadable);

      if (split) {
        return split;
      }

      /*
       * If we cannot safely determine the company,
       * keep the readable value as the title.
       */

      return {
        title: this.toTitleCase(cleanedReadable),
      };
    } catch {
      return {};
    }
  }

  private splitNaukriTitleAndCompany(
    value: string,
  ): ExtractedOpportunityMetadata | undefined {
    if (!value) {
      return undefined;
    }

    /*
     * Company suffixes.
     *
     * These are useful indicators when parsing a Naukri URL.
     */

    const companySuffixes =
      /\b(technologies|technology|services|solutions|systems|consulting|consultants|software|labs|limited|ltd|private|pvt|inc|llc|corp|corporation|group|industries|digital|networks|infotech)\b/i;

    const words = value.split(' ');

    /*
     * Find a company suffix and treat it as part
     * of the company name.
     */

    for (let index = 1; index < words.length; index += 1) {
      const remaining = words.slice(index).join(' ');

      if (companySuffixes.test(remaining)) {
        /*
         * Try potential company starting positions.
         */

        for (
          let companyStart = index;
          companyStart < words.length - 1;
          companyStart += 1
        ) {
          const possibleCompany = words.slice(companyStart).join(' ');

          const possibleTitle = words.slice(0, companyStart).join(' ');

          if (!possibleTitle || !possibleCompany) {
            continue;
          }

          /*
           * Company should contain a recognizable
           * organization suffix.
           */

          if (companySuffixes.test(possibleCompany)) {
            /*
             * Prefer a reasonably sized job title.
             */

            if (
              possibleTitle.split(' ').length >= 2 &&
              possibleCompany.split(' ').length >= 2
            ) {
              return {
                title: this.toTitleCase(possibleTitle),

                company: this.toTitleCase(possibleCompany),
              };
            }
          }
        }
      }
    }

    /*
     * Specific heuristic for:
     *
     * Job Role + Company Name
     *
     * If we have at least 5 words, assume the final
     * 2–4 words may represent a company.
     */

    if (words.length >= 5) {
      /*
       * Try last 3 words as company.
       */

      const titleWords = words.slice(0, -3);
      const companyWords = words.slice(-3);

      if (titleWords.length >= 2) {
        return {
          title: this.toTitleCase(titleWords.join(' ')),

          company: this.toTitleCase(companyWords.join(' ')),
        };
      }
    }

    return undefined;
  }

  /*
   * ============================================================
   * GENERIC URL FALLBACK
   * ============================================================
   */

  private extractFromUrl(url: string): ExtractedOpportunityMetadata {
    if (this.isNaukriUrl(url)) {
      return this.extractNaukriFromUrl(url);
    }

    try {
      const parsedUrl = new URL(url);

      const pathname = decodeURIComponent(parsedUrl.pathname);

      const segments = pathname.split('/').filter(Boolean);

      const lastSegment = segments[segments.length - 1];

      if (!lastSegment) {
        return {};
      }

      const cleaned = lastSegment
        .replace(/\.(html?|php)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        ...(cleaned && {
          title: this.toTitleCase(cleaned),
        }),
      };
    } catch {
      return {};
    }
  }

  /*
   * ============================================================
   * COMPANY EXTRACTION
   * ============================================================
   */

  private extractCompany(
    $: cheerio.CheerioAPI,
    url: string,
  ): string | undefined {
    const siteName =
      this.getMeta($, 'meta[property="og:site_name"]') ??
      this.getMeta($, 'meta[name="application-name"]');

    if (siteName) {
      return this.cleanText(siteName);
    }

    /*
     * Do not use the job platform name as the company.
     *
     * For example:
     *
     * "Naukri" is not the company that posted the job.
     */

    if (this.isLinkedInUrl(url) || this.isNaukriUrl(url)) {
      return undefined;
    }

    try {
      const hostname = new URL(url).hostname;

      return this.cleanText(
        hostname
          .replace(/^www\./, '')
          .split('.')[0]
          .replace(/[-_]/g, ' '),
      );
    } catch {
      return undefined;
    }
  }

  private extractCompanyFromDescription(
    description?: string,
  ): string | undefined {
    if (!description) {
      return undefined;
    }

    /*
     * Example:
     *
     * "Apply for Software Engineer at Goodspace AI in India."
     */

    const applyMatch = description.match(
      /\bapply\s+for\s+.+?\s+at\s+(.+?)(?:\s+in\s+|\.\s|,|\.|$)/i,
    );

    if (applyMatch?.[1]) {
      return this.cleanText(applyMatch[1]);
    }

    const atMatch = description.match(
      /\b(?:job|role|position)\s+(?:at|with)\s+(.+?)(?:\s+in\s+|\.\s|,|\.|$)/i,
    );

    if (atMatch?.[1]) {
      return this.cleanText(atMatch[1]);
    }

    return undefined;
  }

  /*
   * ============================================================
   * URL DETECTION
   * ============================================================
   */

  private isLinkedInUrl(url: string): boolean {
    try {
      const hostname = new URL(url).hostname.toLowerCase();

      return hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com');
    } catch {
      return false;
    }
  }

  private isNaukriUrl(url: string): boolean {
    try {
      const hostname = new URL(url).hostname.toLowerCase();

      return hostname === 'naukri.com' || hostname.endsWith('.naukri.com');
    } catch {
      return false;
    }
  }

  /*
   * ============================================================
   * UTILITIES
   * ============================================================
   */

  private getMeta($: cheerio.CheerioAPI, selector: string): string | undefined {
    return this.cleanText($(selector).first().attr('content'));
  }

  private findFirstPattern(
    value: string,
    patterns: RegExp[],
  ): string | undefined {
    for (const pattern of patterns) {
      const match = value.match(pattern);

      if (match?.[1]) {
        return match[1];
      }
    }

    return undefined;
  }

  private cleanEmbeddedText(value?: string): string | undefined {
    if (!value) {
      return undefined;
    }

    try {
      /*
       * Decode common JSON escaping.
       */

      const decoded = JSON.parse(`"${value}"`);

      return this.cleanText(this.stripHtml(decoded));
    } catch {
      return this.cleanText(this.stripHtml(value));
    }
  }

  private cleanGenericTitle(value?: string): string | undefined {
    if (!value) {
      return undefined;
    }

    let title = value;

    /*
     * Remove common website suffixes.
     */

    title = title.replace(/\s*\|\s*(LinkedIn|Naukri|Indeed|Glassdoor).*$/i, '');

    return this.cleanText(title);
  }

  private stripHtml(value?: unknown): string | undefined {
    if (typeof value !== 'string' || !value) {
      return undefined;
    }

    return cheerio.load(value).text();
  }

  private cleanText(value?: unknown): string | undefined {
    if (typeof value !== 'string' || !value) {
      return undefined;
    }

    const cleaned = value
      .replace(/\s+/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .trim();

    return cleaned || undefined;
  }

  private toTitleCase(value?: string): string | undefined {
    const cleaned = this.cleanText(value);

    if (!cleaned) {
      return undefined;
    }

    /*
     * Preserve words that already contain uppercase
     * characters, such as:
     *
     * AI
     * API
     * DevOps
     * Proarch
     */

    return cleaned
      .split(' ')
      .map((word) => {
        if (word.length <= 4 && word === word.toUpperCase()) {
          return word;
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  private hasUsefulMetadata(metadata: ExtractedOpportunityMetadata): boolean {
    return Boolean(metadata.title || metadata.company || metadata.description);
  }
}
//
