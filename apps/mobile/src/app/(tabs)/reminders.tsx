import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  getReminderSettings,
  saveReminderSettings,
} from "@/lib/reminder-settings";
import { getOpportunities } from "@/lib/opportunities";
import { scheduleReminderNotifications } from "@/lib/notifications";
import type {
  ReminderFrequency,
  ReminderSettings,
} from "@/types/reminder-settings";

const FREQUENCY_OPTIONS: {
  value: ReminderFrequency;
  title: string;
  description: string;
}[] = [
  {
    value: "DAILY",
    title: "Once every day",
    description: "A gentle daily nudge to keep your applications moving.",
  },
  {
    value: "EVERY_3_HOURS",
    title: "Every 3 hours",
    description: "Stay on top of opportunities throughout your day.",
  },
  {
    value: "EVERY_3_DAYS",
    title: "Once every 3 days",
    description: "A lighter reminder for opportunities you want to revisit.",
  },
];

function getTimeFromSettings(settings: ReminderSettings): Date {
  const date = new Date();

  date.setHours(settings.hour);
  date.setMinutes(settings.minute);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

export default function RemindersScreen() {
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const savedSettings = await getReminderSettings();

        if (!cancelled) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error("Failed to load reminder settings:", error);

        if (!cancelled) {
          Alert.alert("Unable to load reminders", "Please try again.");
        }
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleEnabled = (enabled: boolean) => {
    if (!settings) {
      return;
    }

    setSettings({
      ...settings,
      enabled,
    });
  };

  const handleFrequencyChange = (frequency: ReminderFrequency) => {
    if (!settings) {
      return;
    }

    setSettings({
      ...settings,
      frequency,
    });
  };

  const handleTimeChange = (_event: unknown, selectedDate?: Date) => {
    setShowTimePicker(false);

    if (!settings || !selectedDate) {
      return;
    }

    setSettings({
      ...settings,
      hour: selectedDate.getHours(),
      minute: selectedDate.getMinutes(),
    });
  };

  const handleSave = async () => {
    if (!settings) {
      return;
    }

    try {
      setIsSaving(true);

      await saveReminderSettings(settings);

      const opportunities = await getOpportunities();

      await scheduleReminderNotifications(settings, opportunities.length);

      Alert.alert(
        "Reminders updated",
        settings.enabled
          ? "Your reminder schedule has been saved."
          : "Reminders have been turned off.",
      );
    } catch (error) {
      console.error("Failed to save reminder settings:", error);

      Alert.alert(
        "Unable to save reminders",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
          <ActivityIndicator size="small" color="#FF7A1A" />
        </View>

        <Text className="mt-5 text-base font-medium text-slate-500">
          Loading your reminders...
        </Text>
      </View>
    );
  }

  const selectedTime = getTimeFromSettings(settings);

  return (
    <ScrollView
      className="flex-1 bg-surface"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 48,
      }}
    >
      {/* Header */}
      <View>
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
          <Text className="text-2xl">🔔</Text>
        </View>

        <Text className="mt-7 text-sm font-bold uppercase tracking-widest text-brand-600">
          Stay on track
        </Text>

        <Text className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          Reminders.
        </Text>

        <Text className="mt-3 text-base leading-6 text-slate-500">
          A small nudge can make the difference between saving a job and
          actually applying.
        </Text>
      </View>

      {/* Main reminder control */}
      <View className="mt-8 rounded-3xl bg-white p-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-5">
            <Text className="text-lg font-bold text-slate-950">
              Opportunity reminders
            </Text>

            <Text className="mt-1.5 text-sm leading-5 text-slate-500">
              Get notified when it is time to review the opportunities
              you&apos;ve saved.
            </Text>
          </View>

          <Switch
            value={settings.enabled}
            onValueChange={handleToggleEnabled}
            trackColor={{
              false: "#E2E8F0",
              true: "#FFD9C2",
            }}
            thumbColor={settings.enabled ? "#FF7A1A" : "#FFFFFF"}
          />
        </View>

        {/* Status */}
        <View className="mt-5 flex-row items-center">
          <View
            className={`h-2.5 w-2.5 rounded-full ${
              settings.enabled ? "bg-brand-500" : "bg-slate-300"
            }`}
          />

          <Text
            className={`ml-2 text-sm font-semibold ${
              settings.enabled ? "text-brand-700" : "text-slate-400"
            }`}
          >
            {settings.enabled ? "Reminders are active" : "Reminders are off"}
          </Text>
        </View>
      </View>

      {settings.enabled && (
        <>
          {/* Frequency */}
          <View className="mt-9">
            <Text className="text-xl font-bold text-slate-950">How often?</Text>

            <Text className="mt-1 text-sm text-slate-500">
              Choose how often ApplyTMRW should check in with you.
            </Text>
          </View>

          <View className="mt-4 gap-3">
            {FREQUENCY_OPTIONS.map((option) => {
              const isSelected = settings.frequency === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleFrequencyChange(option.value)}
                  className={`rounded-3xl border p-5 active:opacity-90 ${
                    isSelected
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-brand-500" : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <View className="h-3 w-3 rounded-full bg-brand-500" />
                      )}
                    </View>

                    <View className="ml-4 flex-1">
                      <Text
                        className={`text-base font-bold ${
                          isSelected ? "text-brand-700" : "text-slate-950"
                        }`}
                      >
                        {option.title}
                      </Text>

                      <Text className="mt-1 text-sm leading-5 text-slate-500">
                        {option.description}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Time */}
          <View className="mt-9">
            <Text className="text-xl font-bold text-slate-950">
              Preferred time
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              We&apos;ll use this as the starting time for your reminders.
            </Text>
          </View>

          <Pressable
            onPress={() => setShowTimePicker(true)}
            className="mt-4 rounded-3xl border border-slate-100 bg-white p-5 active:bg-brand-50"
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Reminder time
                </Text>

                <Text className="mt-1 text-2xl font-bold text-slate-950">
                  {selectedTime.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Text>
              </View>

              <View className="rounded-2xl bg-brand-100 px-4 py-2">
                <Text className="font-bold text-brand-700">Change</Text>
              </View>
            </View>
          </Pressable>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </>
      )}

      {/* Save */}
      <Pressable
        onPress={() => void handleSave()}
        disabled={isSaving}
        className="mt-10 items-center rounded-2xl bg-brand-500 py-4 active:bg-brand-600 disabled:bg-brand-300"
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-base font-bold text-white">
            Save reminder settings
          </Text>
        )}
      </Pressable>

      {/* Bottom note */}
      <View className="mt-5 rounded-2xl bg-brand-50 p-4">
        <Text className="text-center text-xs leading-5 text-brand-700">
          ApplyTMRW is here to help you turn saved opportunities into
          applications.
        </Text>
      </View>
    </ScrollView>
  );
}
