import { api } from "./api";

import type { CreateReminderRequest, Reminder } from "@/types/reminder";

export function getReminders(opportunityId: string): Promise<Reminder[]> {
  return api<Reminder[]>(`/opportunities/${opportunityId}/reminders`, {
    method: "GET",
    authenticated: true,
  });
}

export function createReminder(
  opportunityId: string,
  data: CreateReminderRequest,
): Promise<Reminder> {
  return api<Reminder>(`/opportunities/${opportunityId}/reminders`, {
    method: "POST",
    authenticated: true,
    body: JSON.stringify(data),
  });
}

export function completeReminder(
  opportunityId: string,
  reminderId: string,
): Promise<Reminder> {
  return api<Reminder>(
    `/opportunities/${opportunityId}/reminders/${reminderId}/complete`,
    {
      method: "PATCH",
      authenticated: true,
    },
  );
}

export function deleteReminder(
  opportunityId: string,
  reminderId: string,
): Promise<Reminder> {
  return api<Reminder>(
    `/opportunities/${opportunityId}/reminders/${reminderId}`,
    {
      method: "DELETE",
      authenticated: true,
    },
  );
}
