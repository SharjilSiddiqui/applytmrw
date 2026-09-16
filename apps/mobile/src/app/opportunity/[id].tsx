import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useFocusEffect, useLocalSearchParams, router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  completeReminder,
  createReminder,
  deleteReminder,
  getReminders,
} from "@/lib/reminders";
import { deleteOpportunity, getOpportunity } from "@/lib/opportunities";

import type { Opportunity, OpportunityStatus } from "@/types/opportunity";
import type { Reminder, ReminderType } from "@/types/reminder";

const STATUS_LABELS: Record<OpportunityStatus, string> = {
  SAVED: "Saved",
  INTERESTED: "Interested",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
};

const STATUS_TEXT_STYLES: Record<OpportunityStatus, string> = {
  SAVED: "text-brand-700",
  INTERESTED: "text-cyan-700",
  APPLIED: "text-purple-700",
  INTERVIEWING: "text-amber-700",
  OFFER: "text-green-700",
  REJECTED: "text-red-700",
  ARCHIVED: "text-slate-600",
};

const STATUS_BACKGROUND_STYLES: Record<OpportunityStatus, string> = {
  SAVED: "bg-brand-100",
  INTERESTED: "bg-cyan-100",
  APPLIED: "bg-purple-100",
  INTERVIEWING: "bg-amber-100",
  OFFER: "bg-green-100",
  REJECTED: "bg-red-100",
  ARCHIVED: "bg-slate-200",
};

const REMINDER_LABELS: Record<ReminderType, string> = {
  FOLLOW_UP: "Follow up",
  APPLICATION_DEADLINE: "Application deadline",
  CUSTOM: "Custom",
};

const REMINDER_TYPES: ReminderType[] = [
  "FOLLOW_UP",
  "APPLICATION_DEADLINE",
  "CUSTOM",
];

export default function OpportunityDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReminders, setIsLoadingReminders] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);

  const [selectedReminderType, setSelectedReminderType] =
    useState<ReminderType>("FOLLOW_UP");

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const loadOpportunity = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);

      const data = await getOpportunity(id);

      setOpportunity(data);
    } catch (error) {
      console.error("Failed to load opportunity:", error);

      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to load opportunity.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadReminders = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoadingReminders(true);

      const data = await getReminders(id);

      setReminders(data);
    } catch (error) {
      console.error("Failed to load reminders:", error);
    } finally {
      setIsLoadingReminders(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void loadOpportunity();
      void loadReminders();
    }, [loadOpportunity, loadReminders]),
  );

  const handleOpenUrl = async () => {
    if (!opportunity) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(opportunity.url);

      if (!supported) {
        Alert.alert("Unable to open link", "This job URL cannot be opened.");

        return;
      }

      await Linking.openURL(opportunity.url);
    } catch (error) {
      console.error("Failed to open URL:", error);

      Alert.alert("Error", "Failed to open the job link.");
    }
  };

  const handleDelete = () => {
    if (!opportunity) {
      return;
    }

    Alert.alert(
      "Delete opportunity?",
      `Are you sure you want to delete "${opportunity.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);

              await deleteOpportunity(opportunity.id);

              router.back();
            } catch (error) {
              console.error("Failed to delete opportunity:", error);

              Alert.alert(
                "Error",
                error instanceof Error
                  ? error.message
                  : "Failed to delete opportunity.",
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);

    if (event.type !== "set" || !date) {
      return;
    }

    const nextDate = new Date(selectedDate);

    nextDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

    setSelectedDate(nextDate);

    if (Platform.OS === "android") {
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowTimePicker(false);

    if (event.type !== "set" || !date) {
      return;
    }

    const nextDate = new Date(selectedDate);

    nextDate.setHours(date.getHours(), date.getMinutes());

    setSelectedDate(nextDate);
  };

  const handleCreateReminder = async () => {
    if (!id) {
      return;
    }

    try {
      setIsCreatingReminder(true);

      const reminder = await createReminder(id, {
        type: selectedReminderType,
        scheduledAt: selectedDate.toISOString(),
      });

      setReminders((currentReminders) => [...currentReminders, reminder]);
    } catch (error) {
      console.error("Failed to create reminder:", error);

      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create reminder.",
      );
    } finally {
      setIsCreatingReminder(false);
    }
  };

  const handleCompleteReminder = async (reminder: Reminder) => {
    if (!id || reminder.completed) {
      return;
    }

    try {
      const updatedReminder = await completeReminder(id, reminder.id);

      setReminders((currentReminders) =>
        currentReminders.map((currentReminder) =>
          currentReminder.id === updatedReminder.id
            ? updatedReminder
            : currentReminder,
        ),
      );
    } catch (error) {
      console.error("Failed to complete reminder:", error);

      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to complete reminder.",
      );
    }
  };

  const handleDeleteReminder = (reminder: Reminder) => {
    if (!id) {
      return;
    }

    Alert.alert(
      "Delete reminder?",
      "Are you sure you want to delete this reminder?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReminder(id, reminder.id);

              setReminders((currentReminders) =>
                currentReminders.filter(
                  (currentReminder) => currentReminder.id !== reminder.id,
                ),
              );
            } catch (error) {
              console.error("Failed to delete reminder:", error);

              Alert.alert(
                "Error",
                error instanceof Error
                  ? error.message
                  : "Failed to delete reminder.",
              );
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-100">
          <ActivityIndicator color="#FF7A1A" />
        </View>

        <Text className="mt-4 text-base font-medium text-slate-500">
          Loading opportunity...
        </Text>
      </View>
    );
  }

  if (!opportunity) {
    return (
      <View className="flex-1 items-center justify-center bg-surface px-6">
        <View className="h-16 w-16 items-center justify-center rounded-3xl bg-brand-100">
          <Text className="text-2xl font-bold text-brand-600">?</Text>
        </View>

        <Text className="mt-5 text-xl font-bold text-slate-900">
          Opportunity not found
        </Text>

        <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
          This opportunity may have been removed or is no longer available.
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-6 rounded-2xl bg-brand-500 px-6 py-3.5 active:bg-brand-600"
        >
          <Text className="font-bold text-white">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 48,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-white active:bg-brand-50"
        >
          <Text className="text-xl text-slate-700">‹</Text>
        </Pressable>

        <Text className="text-sm font-semibold text-slate-400">
          Opportunity
        </Text>

        <View className="w-10" />
      </View>

      {/* Opportunity hero */}
      <View className="mt-8 rounded-3xl bg-white p-6">
        <View className="flex-row items-start justify-between">
          <View className="mr-4 flex-1">
            <Text className="text-3xl font-bold tracking-tight text-slate-900">
              {opportunity.title ?? "Untitled opportunity"}
            </Text>

            <Text className="mt-2 text-lg font-medium text-slate-500">
              {opportunity.company ?? "Company not identified yet"}
            </Text>
          </View>

          <View
            className={`rounded-full px-3 py-2 ${
              STATUS_BACKGROUND_STYLES[opportunity.status]
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                STATUS_TEXT_STYLES[opportunity.status]
              }`}
            >
              {STATUS_LABELS[opportunity.status]}
            </Text>
          </View>
        </View>

        <View className="mt-6 h-px bg-slate-100" />

        <View className="mt-5 flex-row items-center">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-100">
            <Text className="text-xs font-bold text-brand-600">FROM</Text>
          </View>

          <View className="ml-3">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Source
            </Text>

            <Text className="mt-0.5 text-sm font-semibold text-slate-700">
              {opportunity.source}
            </Text>
          </View>
        </View>
      </View>

      {/* Job link */}
      <View className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
        <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Job posting
        </Text>

        <Text
          className="mt-2 text-sm leading-5 text-slate-500"
          numberOfLines={2}
        >
          {opportunity.url}
        </Text>

        <Pressable
          onPress={() => void handleOpenUrl()}
          className="mt-4 flex-row items-center justify-center rounded-2xl bg-brand-500 py-3.5 active:bg-brand-600"
        >
          <Text className="font-bold text-white">Open job posting</Text>

          <Text className="ml-2 text-lg font-bold text-white">↗</Text>
        </Pressable>
      </View>

      {/* Notes */}
      {opportunity.description ? (
        <View className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Notes
          </Text>

          <Text className="mt-3 text-base leading-6 text-slate-600">
            {opportunity.description}
          </Text>
        </View>
      ) : null}

      {/* Reminders */}
      <View className="mt-5">
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-xl font-bold text-slate-900">Reminders</Text>

            <Text className="mt-1 text-sm text-slate-500">
              Never lose track of your next step.
            </Text>
          </View>

          {reminders.length > 0 ? (
            <View className="rounded-full bg-brand-100 px-3 py-1.5">
              <Text className="text-xs font-bold text-brand-700">
                {reminders.length}
              </Text>
            </View>
          ) : null}
        </View>

        {isLoadingReminders ? (
          <View className="mt-5 items-center rounded-3xl border border-slate-200 bg-white p-8">
            <ActivityIndicator color="#FF7A1A" />
          </View>
        ) : reminders.length === 0 ? (
          <View className="mt-5 rounded-3xl border border-dashed border-brand-200 bg-brand-50 p-6">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white">
              <Text className="text-lg">⏰</Text>
            </View>

            <Text className="mt-4 text-base font-bold text-slate-900">
              No reminders yet
            </Text>

            <Text className="mt-1 text-sm leading-5 text-slate-500">
              Add one below so you know when it&apos;s time to take action.
            </Text>
          </View>
        ) : (
          <View className="mt-5 gap-3">
            {reminders.map((reminder) => (
              <View
                key={reminder.id}
                className={`rounded-3xl border p-5 ${
                  reminder.completed
                    ? "border-slate-200 bg-slate-50"
                    : "border-brand-200 bg-white"
                }`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <View className="flex-row items-center">
                      <View
                        className={`h-9 w-9 items-center justify-center rounded-xl ${
                          reminder.completed ? "bg-slate-200" : "bg-brand-100"
                        }`}
                      >
                        <Text
                          className={`text-sm font-bold ${
                            reminder.completed
                              ? "text-slate-500"
                              : "text-brand-600"
                          }`}
                        >
                          {reminder.completed ? "✓" : "!"}
                        </Text>
                      </View>

                      <Text
                        className={`ml-3 text-base font-bold ${
                          reminder.completed
                            ? "text-slate-500"
                            : "text-slate-900"
                        }`}
                      >
                        {REMINDER_LABELS[reminder.type]}
                      </Text>
                    </View>

                    <Text className="mt-3 text-sm text-slate-500">
                      {new Date(reminder.scheduledAt).toLocaleString()}
                    </Text>

                    {reminder.completed ? (
                      <Text className="mt-1 text-sm font-semibold text-green-600">
                        Completed
                      </Text>
                    ) : null}
                  </View>

                  <Pressable
                    onPress={() => handleDeleteReminder(reminder)}
                    className="rounded-full bg-red-50 px-3 py-2 active:bg-red-100"
                  >
                    <Text className="text-xs font-bold text-red-600">
                      Delete
                    </Text>
                  </Pressable>
                </View>

                {!reminder.completed ? (
                  <Pressable
                    onPress={() => void handleCompleteReminder(reminder)}
                    className="mt-4 items-center rounded-2xl bg-green-600 py-3"
                  >
                    <Text className="font-bold text-white">
                      Mark as complete
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* Add reminder */}
        <View className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
          <View className="flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
              <Text className="text-lg">⏰</Text>
            </View>

            <View className="ml-3">
              <Text className="text-base font-bold text-slate-900">
                Add a reminder
              </Text>

              <Text className="mt-0.5 text-sm text-slate-500">
                Choose when you want to follow up.
              </Text>
            </View>
          </View>

          <Text className="mt-6 text-sm font-semibold text-slate-700">
            Reminder type
          </Text>

          <View className="mt-3 gap-2">
            {REMINDER_TYPES.map((type) => {
              const isSelected = selectedReminderType === type;

              return (
                <Pressable
                  key={type}
                  onPress={() => setSelectedReminderType(type)}
                  className={`flex-row items-center justify-between rounded-2xl border px-4 py-3.5 ${
                    isSelected
                      ? "border-brand-200 bg-brand-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? "text-brand-700" : "text-slate-600"
                    }`}
                  >
                    {REMINDER_LABELS[type]}
                  </Text>

                  <View
                    className={`h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-brand-500 bg-brand-500"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected ? (
                      <View className="h-2 w-2 rounded-full bg-white" />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Text className="mt-6 text-sm font-semibold text-slate-700">
            Scheduled for
          </Text>

          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <Text className="text-base font-medium text-slate-800">
              {selectedDate.toLocaleString()}
            </Text>

            <Text className="mt-1 text-xs text-slate-400">
              Tap to choose a date and time
            </Text>
          </Pressable>

          {showDatePicker ? (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          ) : null}

          {showTimePicker ? (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          ) : null}

          <Pressable
            onPress={() => void handleCreateReminder()}
            disabled={isCreatingReminder}
            className={`mt-5 items-center rounded-2xl py-3.5 ${
              isCreatingReminder ? "bg-brand-300" : "bg-brand-500"
            }`}
          >
            {isCreatingReminder ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-bold text-white">Add reminder</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Added */}
      <View className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
        <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Added
        </Text>

        <Text className="mt-2 text-sm font-medium text-slate-600">
          {new Date(opportunity.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Actions */}
      <View className="mt-6 gap-3">
        <Pressable
          onPress={() => router.push(`/opportunity/${opportunity.id}/edit`)}
          className="items-center rounded-2xl bg-slate-900 py-4 active:bg-slate-800"
        >
          <Text className="text-base font-bold text-white">
            Edit opportunity
          </Text>
        </Pressable>

        <Pressable
          onPress={() => void handleOpenUrl()}
          className="items-center rounded-2xl border border-brand-200 bg-brand-50 py-4 active:bg-brand-100"
        >
          <Text className="text-base font-bold text-brand-700">
            Open job link
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDelete}
          disabled={isDeleting}
          className="items-center rounded-2xl bg-red-50 py-4 active:bg-red-100"
        >
          <Text className="text-base font-bold text-red-600">
            {isDeleting ? "Deleting..." : "Delete opportunity"}
          </Text>
        </Pressable>
      </View>

      <Text className="mt-5 text-center text-xs leading-5 text-slate-400">
        Keep your opportunities organized. Save today, apply tomorrow.
      </Text>
    </ScrollView>
  );
}
