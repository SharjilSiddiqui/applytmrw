import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, router } from "expo-router";
import { useCallback, useState } from "react";

import { deleteOpportunity, getOpportunity } from "@/lib/opportunities";

import type { Opportunity, OpportunityStatus } from "@/types/opportunity";

const STATUS_LABELS: Record<OpportunityStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

const STATUS_STYLES: Record<OpportunityStatus, string> = {
  SAVED: "bg-blue-100 text-blue-700",
  APPLIED: "bg-purple-100 text-purple-700",
  INTERVIEW: "bg-yellow-100 text-yellow-700",
  OFFER: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function OpportunityDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      void loadOpportunity();
    }, [loadOpportunity]),
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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
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
      contentContainerClassName="px-6 py-8"
    >
      {/* Back */}

      <Pressable onPress={() => router.back()} className="mb-10">
        <Text className="text-base font-semibold text-blue-700">← Back</Text>
      </Pressable>

      {/* Header */}

      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-3xl font-bold text-slate-900">
            {opportunity.title}
          </Text>

          <Text className="mt-2 text-xl text-slate-600">
            {opportunity.company}
          </Text>
        </View>

        <View
          className={`rounded-full px-3 py-2 ${
            STATUS_STYLES[opportunity.status]
          }`}
        >
          <Text className="text-sm font-semibold">
            {STATUS_LABELS[opportunity.status]}
          </Text>
        </View>
      </View>

      {/* Source */}

      <View className="mt-10">
        <Text className="text-sm font-medium uppercase tracking-wide text-slate-400">
          Source
        </Text>

        <Text className="mt-2 text-base font-semibold text-slate-800">
          {opportunity.source}
        </Text>
      </View>

      {/* Job URL */}

      <View className="mt-8">
        <Text className="text-sm font-medium uppercase tracking-wide text-slate-400">
          Job URL
        </Text>

        <Pressable onPress={() => void handleOpenUrl()} className="mt-2">
          <Text className="text-base text-blue-600 underline" numberOfLines={2}>
            {opportunity.url}
          </Text>
        </Pressable>
      </View>

      {/* Description */}

      {opportunity.description ? (
        <View className="mt-8">
          <Text className="text-sm font-medium uppercase tracking-wide text-slate-400">
            Notes
          </Text>

          <Text className="mt-3 text-base leading-6 text-slate-600">
            {opportunity.description}
          </Text>
        </View>
      ) : null}

      {/* Dates */}

      <View className="mt-8">
        <Text className="text-sm font-medium uppercase tracking-wide text-slate-400">
          Added
        </Text>

        <Text className="mt-2 text-base text-slate-600">
          {new Date(opportunity.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Actions */}

      <View className="mt-12 gap-4">
        <Pressable
          onPress={() => router.push(`/opportunity/${opportunity.id}/edit`)}
          className="items-center rounded-xl bg-slate-800 py-4"
        >
          <Text className="text-base font-semibold text-white">
            Edit opportunity
          </Text>
        </Pressable>

        <Pressable
          onPress={handleOpenUrl}
          className="items-center rounded-xl bg-blue-600 py-4"
        >
          <Text className="text-base font-semibold text-white">
            Open job link
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDelete}
          disabled={isDeleting}
          className="items-center rounded-xl bg-red-500 py-4"
        >
          <Text className="text-base font-semibold text-white">
            {isDeleting ? "Deleting..." : "Delete opportunity"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
