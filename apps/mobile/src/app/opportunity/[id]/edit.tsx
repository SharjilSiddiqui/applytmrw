import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { getOpportunity, updateOpportunity } from "@/lib/opportunities";

import type {
  Opportunity,
  OpportunitySource,
  OpportunityStatus,
} from "@/types/opportunity";

const SOURCES: OpportunitySource[] = [
  "LINKEDIN",
  "INSTAGRAM",
  "X",
  "FACEBOOK",
  "WEBSITE",
  "OTHER",
];

const STATUSES: OpportunityStatus[] = [
  "SAVED",
  "INTERESTED",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
  "ARCHIVED",
];

function formatLabel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export default function EditOpportunityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const [source, setSource] = useState<OpportunitySource>("LINKEDIN");
  const [status, setStatus] = useState<OpportunityStatus>("SAVED");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadOpportunity = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);

      const data = await getOpportunity(id);

      setOpportunity(data);

      setTitle(data.title ?? "");
      setCompany(data.company ?? "");
      setUrl(data.url);
      setDescription(data.description ?? "");
      setSource(data.source);
      setStatus(data.status);
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

  useEffect(() => {
    // Loading remote opportunity data is an intentional effect.
    // The loader updates local state after the API request completes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOpportunity();
  }, [loadOpportunity]);

  const handleUpdate = async () => {
    if (!id || !opportunity) {
      return;
    }

    if (!title.trim() || !company.trim() || !url.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter a title, company, and job URL.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await updateOpportunity(id, {
        title: title.trim(),
        company: company.trim(),
        url: url.trim(),
        source,
        status,
        description: description.trim() || null,
      });

      router.back();
    } catch (error) {
      console.error("Failed to update opportunity:", error);

      Alert.alert(
        "Unable to update opportunity",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
      keyboardShouldPersistTaps="handled"
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
          Edit opportunity
        </Text>

        <View className="w-10" />
      </View>

      {/* Intro */}
      <View className="mt-8">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-100">
          <Text className="text-xl font-bold text-brand-600">✎</Text>
        </View>

        <Text className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
          Keep your opportunity up to date.
        </Text>

        <Text className="mt-3 text-base leading-6 text-slate-500">
          Update the details, status, or notes whenever something changes.
        </Text>
      </View>

      {/* Basic details */}
      <View className="mt-8 rounded-3xl border border-slate-200 bg-white p-5">
        <Text className="text-lg font-bold text-slate-900">
          Opportunity details
        </Text>

        <Text className="mt-1 text-sm text-slate-500">
          Update the information for this opportunity.
        </Text>

        {/* Title */}
        <View className="mt-6">
          <Text className="mb-2 text-sm font-semibold text-slate-700">
            Job title
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Software Engineer Intern"
            placeholderTextColor="#94A3B8"
            returnKeyType="next"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900"
          />
        </View>

        {/* Company */}
        <View className="mt-5">
          <Text className="mb-2 text-sm font-semibold text-slate-700">
            Company
          </Text>

          <TextInput
            value={company}
            onChangeText={setCompany}
            placeholder="Company name"
            placeholderTextColor="#94A3B8"
            returnKeyType="next"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900"
          />
        </View>

        {/* URL */}
        <View className="mt-5">
          <Text className="mb-2 text-sm font-semibold text-slate-700">
            Job URL
          </Text>

          <TextInput
            value={url}
            onChangeText={setUrl}
            placeholder="https://..."
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900"
          />

          <Text className="mt-2 text-xs text-slate-400">
            Keep the link handy so you can return to the posting quickly.
          </Text>
        </View>
      </View>

      {/* Source */}
      <View className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
        <Text className="text-base font-bold text-slate-900">
          Where did you find it?
        </Text>

        <Text className="mt-1 text-sm text-slate-500">
          Update the platform where you discovered this opportunity.
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {SOURCES.map((item) => {
            const selected = source === item;

            return (
              <Pressable
                key={item}
                onPress={() => setSource(item)}
                className={`rounded-full border px-4 py-2.5 ${
                  selected
                    ? "border-brand-500 bg-brand-500"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selected ? "text-white" : "text-slate-600"
                  }`}
                >
                  {formatLabel(item)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Status */}
      <View className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
        <Text className="text-base font-bold text-slate-900">
          Current status
        </Text>

        <Text className="mt-1 text-sm text-slate-500">
          Keep track of where you are in the application process.
        </Text>

        <View className="mt-4 gap-2">
          {STATUSES.map((item) => {
            const selected = status === item;

            return (
              <Pressable
                key={item}
                onPress={() => setStatus(item)}
                className={`flex-row items-center justify-between rounded-2xl border px-4 py-3.5 ${
                  selected
                    ? "border-brand-200 bg-brand-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selected ? "text-brand-700" : "text-slate-600"
                  }`}
                >
                  {formatLabel(item)}
                </Text>

                <View
                  className={`h-5 w-5 items-center justify-center rounded-full border ${
                    selected
                      ? "border-brand-500 bg-brand-500"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {selected && (
                    <View className="h-2 w-2 rounded-full bg-white" />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Notes */}
      <View className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
        <Text className="text-base font-bold text-slate-900">
          Notes <Text className="font-normal text-slate-400">(optional)</Text>
        </Text>

        <Text className="mt-1 text-sm text-slate-500">
          Keep any useful thoughts or reminders about this opportunity.
        </Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Why is this opportunity interesting?"
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
          className="mt-4 min-h-32.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900"
        />
      </View>

      {/* Save */}
      <Pressable
        disabled={isSubmitting}
        onPress={() => void handleUpdate()}
        className={`mt-6 items-center rounded-2xl py-4 ${
          isSubmitting ? "bg-brand-300" : "bg-brand-500"
        }`}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-bold text-white">Save changes</Text>
        )}
      </Pressable>

      <Text className="mt-4 text-center text-xs leading-5 text-slate-400">
        Your changes will be saved to this opportunity.
      </Text>
    </ScrollView>
  );
}
