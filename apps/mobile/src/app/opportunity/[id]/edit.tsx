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

const SOURCES: OpportunitySource[] = ["LINKEDIN", "INDEED", "NAUKRI", "OTHER"];

const STATUSES: OpportunityStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
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

      setTitle(data.title);
      setCompany(data.company);
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
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />

        <Text className="mt-4 text-base text-slate-500">
          Loading opportunity...
        </Text>
      </View>
    );
  }

  if (!opportunity) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-semibold text-slate-900">
          Opportunity not found
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3"
        >
          <Text className="font-semibold text-white">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pt-16 pb-10"
      keyboardShouldPersistTaps="handled"
    >
      {/* Back */}

      <Pressable onPress={() => router.back()}>
        <Text className="text-base font-medium text-blue-600">← Back</Text>
      </Pressable>

      {/* Header */}

      <Text className="mt-8 text-3xl font-bold text-slate-900">
        Edit opportunity
      </Text>

      <Text className="mt-2 text-base text-slate-500">
        Update the details for this opportunity.
      </Text>

      {/* TITLE */}

      <View className="mt-10">
        <Text className="mb-2 text-sm font-semibold text-slate-700">
          Job title
        </Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Software Engineer Intern"
          className="rounded-xl border border-slate-300 px-4 py-4 text-base text-slate-900"
        />
      </View>

      {/* COMPANY */}

      <View className="mt-5">
        <Text className="mb-2 text-sm font-semibold text-slate-700">
          Company
        </Text>

        <TextInput
          value={company}
          onChangeText={setCompany}
          placeholder="Company name"
          className="rounded-xl border border-slate-300 px-4 py-4 text-base text-slate-900"
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
          autoCapitalize="none"
          keyboardType="url"
          className="rounded-xl border border-slate-300 px-4 py-4 text-base text-slate-900"
        />
      </View>

      {/* SOURCE */}

      <View className="mt-6">
        <Text className="mb-3 text-sm font-semibold text-slate-700">
          Source
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {SOURCES.map((item) => {
            const selected = source === item;

            return (
              <Pressable
                key={item}
                onPress={() => setSource(item)}
                className={`rounded-full px-4 py-2 ${
                  selected ? "bg-blue-600" : "bg-slate-100"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
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

      {/* STATUS */}

      <View className="mt-6">
        <Text className="mb-3 text-sm font-semibold text-slate-700">
          Status
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {STATUSES.map((item) => {
            const selected = status === item;

            return (
              <Pressable
                key={item}
                onPress={() => setStatus(item)}
                className={`rounded-full px-4 py-2 ${
                  selected ? "bg-blue-600" : "bg-slate-100"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
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

      {/* DESCRIPTION */}

      <View className="mt-6">
        <Text className="mb-2 text-sm font-semibold text-slate-700">
          Description
          <Text className="font-normal text-slate-400"> (optional)</Text>
        </Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Add notes about this opportunity..."
          multiline
          textAlignVertical="top"
          className="min-h-[120px] rounded-xl border border-slate-300 px-4 py-4 text-base text-slate-900"
        />
      </View>

      {/* SUBMIT */}

      <Pressable
        disabled={isSubmitting}
        onPress={() => void handleUpdate()}
        className={`mt-10 items-center rounded-xl py-4 ${
          isSubmitting ? "bg-blue-300" : "bg-blue-600"
        }`}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-semibold text-white">
            Save changes
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
