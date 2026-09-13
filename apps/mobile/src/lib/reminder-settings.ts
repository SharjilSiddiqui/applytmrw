import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DEFAULT_REMINDER_SETTINGS,
  type ReminderSettings,
} from "@/types/reminder-settings";

const REMINDER_SETTINGS_KEY = "apply-tmrw-reminder-settings";

export async function getReminderSettings(): Promise<ReminderSettings> {
  const value = await AsyncStorage.getItem(REMINDER_SETTINGS_KEY);

  if (!value) {
    return DEFAULT_REMINDER_SETTINGS;
  }

  try {
    const parsed = JSON.parse(value) as Partial<ReminderSettings>;

    return {
      ...DEFAULT_REMINDER_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

export async function saveReminderSettings(
  settings: ReminderSettings,
): Promise<void> {
  await AsyncStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
}
