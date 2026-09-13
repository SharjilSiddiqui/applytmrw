export type ReminderFrequency = "DAILY" | "EVERY_3_HOURS" | "EVERY_3_DAYS";

export interface ReminderSettings {
  enabled: boolean;
  frequency: ReminderFrequency;

  hour: number;
  minute: number;
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  frequency: "DAILY",
  hour: 9,
  minute: 0,
};
