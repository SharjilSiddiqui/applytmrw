export type OpportunitySource = "LINKEDIN" | "INDEED" | "NAUKRI" | "OTHER";

export type OpportunityStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

export interface Opportunity {
  id: string;
  userId: string;

  url: string;
  source: OpportunitySource;

  title: string;
  company: string;

  description: string | null;
  status: OpportunityStatus;

  metadata: Record<string, unknown> | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateOpportunityRequest {
  url: string;
  source: OpportunitySource;

  title: string;
  company: string;

  description?: string;
  status?: OpportunityStatus;

  metadata?: Record<string, unknown>;
}

export interface UpdateOpportunityRequest {
  url?: string;
  source?: OpportunitySource;

  title?: string;
  company?: string;

  description?: string | null;
  status?: OpportunityStatus;

  metadata?: Record<string, unknown> | null;
}
