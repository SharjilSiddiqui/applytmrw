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
    description: "Get one reminder every day.",
  },
  {
    value: "EVERY_3_HOURS",
    title: "Every 3 hours",
    description: "Get reminded every 3 hours.",
  },
  {
    value: "EVERY_3_DAYS",
    title: "Once every 3 days",
    description: "Get one reminder every 3 days.",
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

      await scheduleReminderNotifications(settings);

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
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />

        <Text className="mt-4 text-base text-slate-500">
          Loading reminder settings...
        </Text>
      </View>
    );
  }

  const selectedTime = getTimeFromSettings(settings);

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 48,
      }}
    >
      <Text className="text-4xl font-bold text-slate-900">Reminders 🔔</Text>

      <Text className="mt-3 text-base leading-6 text-slate-500">
        Set reminders to regularly review all your saved opportunities.
      </Text>

      <View className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-lg font-semibold text-slate-900">
              Opportunity reminders
            </Text>

            <Text className="mt-1 text-sm leading-5 text-slate-500">
              Receive notifications to review your opportunities.
            </Text>
          </View>

          <Switch
            value={settings.enabled}
            onValueChange={handleToggleEnabled}
            trackColor={{
              false: "#E5E7EB",
              true: "#FFD9C2",
            }}
            thumbColor={settings.enabled ? "#FF7A1A" : "#FFFFFF"}
          />
        </View>
      </View>

      {settings.enabled && (
        <>
          <Text className="mt-10 text-lg font-semibold text-slate-900">
            How often?
          </Text>

          <View className="mt-4 gap-3">
            {FREQUENCY_OPTIONS.map((option) => {
              const isSelected = settings.frequency === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleFrequencyChange(option.value)}
                  className={`rounded-2xl border p-5 ${
                    isSelected
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-4">
                      <Text
                        className={`text-base font-semibold ${
                          isSelected ? "text-brand-600" : "text-slate-900"
                        }`}
                      >
                        {option.title}
                      </Text>

                      <Text className="mt-1 text-sm text-slate-500">
                        {option.description}
                      </Text>
                    </View>

                    <View
                      className={`h-5 w-5 rounded-full border-2 ${
                        isSelected ? "border-brand-500" : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <View className="m-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Text className="mt-10 text-lg font-semibold text-slate-900">
            Preferred time
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            Your reminders will start at this time.
          </Text>

          <Pressable
            onPress={() => setShowTimePicker(true)}
            className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <Text className="text-base font-semibold text-slate-900">
              {selectedTime.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
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

      <Pressable
        onPress={() => void handleSave()}
        disabled={isSaving}
        className={`mt-12 items-center rounded-xl py-4 ${
          isSaving ? "bg-brand-300" : "bg-brand-500"
        }`}
      >
        {isSaving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-semibold text-white">
            Save reminder settings
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
