import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

import type { ReminderSettings } from "@/types/reminder-settings";

const REMINDER_NOTIFICATION_TYPE = "apply-tmrw-global-reminder";
const ANDROID_CHANNEL_ID = "reminders";

// Number of future "every 3 days" reminders to schedule.
// 20 reminders = roughly 60 days ahead.
const EVERY_3_DAYS_SCHEDULE_COUNT = 20;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configureNotifications(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  const permissions = await Notifications.getPermissionsAsync();

  if (permissions.status === "granted") {
    return true;
  }

  const request = await Notifications.requestPermissionsAsync();

  return request.status === "granted";
}

export async function cancelReminderNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  const reminderNotifications = scheduled.filter(
    (notification) =>
      notification.content.data?.type === REMINDER_NOTIFICATION_TYPE,
  );

  await Promise.all(
    reminderNotifications.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier),
    ),
  );
}

function getNextScheduledDate(hour: number, minute: number): Date {
  const now = new Date();

  const scheduledDate = new Date();

  scheduledDate.setHours(hour, minute, 0, 0);

  if (scheduledDate <= now) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }

  return scheduledDate;
}

function getNotificationContent() {
  return {
    title: "ApplyTMRW 🚀",
    body: "Take a moment to review your opportunities.",
    sound: "default" as const,
    data: {
      type: REMINDER_NOTIFICATION_TYPE,
    },
  };
}

function getChannelId() {
  return Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined;
}

async function scheduleDailyReminder(
  hour: number,
  minute: number,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: getNotificationContent(),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: getChannelId(),
    },
  });
}

async function scheduleEvery3Hours(settings: ReminderSettings): Promise<void> {
  const startMinutes = settings.hour * 60 + settings.minute;

  // Schedule 8 notifications:
  // 24 hours / 3 hours = 8 reminders per day.
  for (let index = 0; index < 8; index++) {
    const totalMinutes = startMinutes + index * 3 * 60;

    const hour = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minute = totalMinutes % 60;

    await scheduleDailyReminder(hour, minute);
  }
}

async function scheduleEvery3Days(settings: ReminderSettings): Promise<void> {
  const firstReminder = getNextScheduledDate(settings.hour, settings.minute);

  for (let index = 0; index < EVERY_3_DAYS_SCHEDULE_COUNT; index++) {
    const scheduledDate = new Date(firstReminder);

    scheduledDate.setDate(firstReminder.getDate() + index * 3);

    await Notifications.scheduleNotificationAsync({
      content: getNotificationContent(),
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduledDate,
        channelId: getChannelId(),
      },
    });
  }
}

export async function scheduleReminderNotifications(
  settings: ReminderSettings,
): Promise<void> {
  await cancelReminderNotifications();

  if (!settings.enabled) {
    return;
  }

  await configureNotifications();

  const hasPermission = await requestNotificationPermissions();

  if (!hasPermission) {
    throw new Error("Notification permission was not granted.");
  }

  switch (settings.frequency) {
    case "DAILY":
      await scheduleDailyReminder(settings.hour, settings.minute);
      break;

    case "EVERY_3_HOURS":
      await scheduleEvery3Hours(settings);
      break;

    case "EVERY_3_DAYS":
      await scheduleEvery3Days(settings);
      break;
  }
}
