import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useAuth } from "@/contexts/auth-context";
import { getOpportunities } from "@/lib/opportunities";
import type { Opportunity } from "@/types/opportunity";

export default function HomeScreen() {
  const { user } = useAuth();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    try {
      setError(null);

      const data = await getOpportunities();

      setOpportunities(data);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load opportunities.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchOpportunities();
    }, [fetchOpportunities]),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    void fetchOpportunities();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
          <ActivityIndicator size="small" color="#FF7A1A" />
        </View>

        <Text className="mt-5 text-base font-medium text-slate-500">
          Loading your opportunities...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <FlatList
        data={opportunities}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 28,
          paddingBottom: 36,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#FF7A1A"
          />
        }
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                  ApplyTMRW
                </Text>

                <Text className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Your next opportunity.
                </Text>

                <Text className="mt-2 text-base leading-6 text-slate-500">
                  Save today. Apply tomorrow.
                </Text>
              </View>
            </View>

            {/* Welcome card */}
            <View className="mt-7 overflow-hidden rounded-3xl bg-brand-500 p-6">
              <View className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-brand-400 opacity-40" />

              <View className="absolute -bottom-14 -right-2 h-36 w-36 rounded-full bg-brand-600 opacity-30" />

              <Text className="text-sm font-semibold text-orange-100">
                WELCOME BACK
              </Text>

              <Text className="mt-2 text-xl font-bold text-white">
                Welcome back, {user?.name ?? "there"}.
              </Text>

              <Text className="mt-2 max-w-70 text-sm leading-5 text-orange-50">
                Keep the jobs that matter close. We&apos;ll help you remember to
                apply.
              </Text>
            </View>

            {/* Opportunities heading */}
            <View className="mb-5 mt-8 flex-row items-end justify-between">
              <View>
                <Text className="text-xl font-bold text-slate-950">
                  Opportunities
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  {opportunities.length}{" "}
                  {opportunities.length === 1
                    ? "opportunity saved"
                    : "opportunities saved"}
                </Text>
              </View>

              <Pressable
                onPress={() => router.push("/create-opportunity")}
                className="rounded-2xl bg-slate-950 px-5 py-3 active:opacity-80"
              >
                <Text className="font-bold text-white">+ Add</Text>
              </Pressable>
            </View>

            {/* Error */}
            {error && (
              <View className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-5">
                <Text className="font-semibold text-red-800">
                  Couldn&apos;t load opportunities
                </Text>

                <Text className="mt-1 text-sm leading-5 text-red-600">
                  {error}
                </Text>

                <Pressable
                  onPress={() => {
                    setIsLoading(true);
                    void fetchOpportunities();
                  }}
                  className="mt-4 self-start rounded-xl bg-red-600 px-4 py-2.5 active:opacity-80"
                >
                  <Text className="font-semibold text-white">Try again</Text>
                </Pressable>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/opportunity/${item.id}`)}
            className="mb-4 rounded-3xl border border-slate-100 bg-white p-5 active:opacity-90"
          >
            {/* Top row */}
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text
                  numberOfLines={2}
                  className="text-lg font-bold leading-6 text-slate-950"
                >
                  {item.title ?? "Untitled opportunity"}
                </Text>

                <Text
                  numberOfLines={1}
                  className="mt-1.5 text-base font-medium text-slate-600"
                >
                  {item.company ?? "Company not identified yet"}
                </Text>
              </View>

              <View className="rounded-full bg-brand-100 px-3 py-1.5">
                <Text className="text-xs font-bold text-brand-700">
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Description */}
            {item.description && (
              <Text
                numberOfLines={2}
                className="mt-4 text-sm leading-5 text-slate-500"
              >
                {item.description}
              </Text>
            )}

            {/* Footer */}
            <View className="mt-5 flex-row items-center justify-between border-t border-slate-100 pt-4">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {item.source}
              </Text>

              <Text className="text-sm font-bold text-brand-600">View →</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          !error ? (
            <View className="items-center rounded-3xl border border-dashed border-brand-200 bg-brand-50 px-7 py-10">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
                <Text className="text-2xl">✦</Text>
              </View>

              <Text className="mt-5 text-lg font-bold text-slate-950">
                Nothing saved yet
              </Text>

              <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
                When you find a job worth applying for, send it to ApplyTMRW and
                we&apos;ll keep it here.
              </Text>

              <Pressable
                onPress={() => router.push("/create-opportunity")}
                className="mt-6 rounded-2xl bg-brand-500 px-6 py-3.5 active:bg-brand-600"
              >
                <Text className="font-bold text-white">
                  Save your first opportunity
                </Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </View>
  );
}
