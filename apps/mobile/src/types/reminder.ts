export type ReminderType = "FOLLOW_UP" | "APPLICATION_DEADLINE" | "CUSTOM";

export interface Reminder {
  id: string;

  opportunityId: string;

  type: ReminderType;

  scheduledAt: string;

  completed: boolean;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderRequest {
  type: ReminderType;

  scheduledAt: string;
}
