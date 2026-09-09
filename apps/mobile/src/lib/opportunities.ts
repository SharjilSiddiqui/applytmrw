import { api } from "./api";

import type {
  CreateOpportunityRequest,
  Opportunity,
  UpdateOpportunityRequest,
} from "@/types/opportunity";

export function getOpportunities(): Promise<Opportunity[]> {
  return api<Opportunity[]>("/opportunities", {
    method: "GET",
    authenticated: true,
  });
}

export function getOpportunity(id: string): Promise<Opportunity> {
  return api<Opportunity>(`/opportunities/${id}`, {
    method: "GET",
    authenticated: true,
  });
}

export function createOpportunity(
  data: CreateOpportunityRequest,
): Promise<Opportunity> {
  return api<Opportunity>("/opportunities", {
    method: "POST",
    authenticated: true,
    body: JSON.stringify(data),
  });
}

export function updateOpportunity(
  id: string,
  data: UpdateOpportunityRequest,
): Promise<Opportunity> {
  return api<Opportunity>(`/opportunities/${id}`, {
    method: "PATCH",
    authenticated: true,
    body: JSON.stringify(data),
  });
}

export function deleteOpportunity(id: string): Promise<Opportunity> {
  return api<Opportunity>(`/opportunities/${id}`, {
    method: "DELETE",
    authenticated: true,
  });
}
