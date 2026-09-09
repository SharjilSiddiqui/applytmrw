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
  const { user, logout } = useAuth();

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

  const handleLogout = async () => {
    await logout();

    router.replace("/");
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />

        <Text className="mt-4 text-base text-slate-500">
          Loading opportunities...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={opportunities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 48,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View>
            <Text className="text-4xl font-bold text-slate-900">
              ApplyTMRW 🚀
            </Text>

            <Text className="mt-6 text-xl font-semibold text-slate-700">
              Welcome back!
            </Text>

            <Text className="mt-2 text-base text-slate-500">{user?.email}</Text>

            <View className="mt-12 mb-6">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-semibold text-slate-900">
                    Your opportunities
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    {opportunities.length}{" "}
                    {opportunities.length === 1
                      ? "opportunity"
                      : "opportunities"}
                  </Text>
                </View>

                <Pressable
                  onPress={() => router.push("/create-opportunity")}
                  className="rounded-xl bg-blue-600 px-4 py-3"
                >
                  <Text className="font-semibold text-white">+ Add</Text>
                </Pressable>
              </View>
            </View>

            {error && (
              <View className="mb-4 rounded-xl bg-red-50 p-4">
                <Text className="text-sm text-red-600">{error}</Text>

                <Pressable
                  onPress={() => {
                    setIsLoading(true);
                    void fetchOpportunities();
                  }}
                  className="mt-3"
                >
                  <Text className="font-semibold text-red-600">Try again</Text>
                </Pressable>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/opportunity/${item.id}`)}
            className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text
                  numberOfLines={2}
                  className="text-lg font-bold text-slate-900"
                >
                  {item.title}
                </Text>

                <Text className="mt-1 text-base text-slate-600">
                  {item.company}
                </Text>
              </View>

              <View className="rounded-full bg-blue-100 px-3 py-1">
                <Text className="text-xs font-semibold text-blue-700">
                  {item.status}
                </Text>
              </View>
            </View>

            {item.description && (
              <Text
                numberOfLines={2}
                className="mt-4 text-sm leading-5 text-slate-500"
              >
                {item.description}
              </Text>
            )}

            <Text className="mt-4 text-xs font-medium text-slate-400">
              {item.source}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          !error ? (
            <View className="items-center py-12">
              <Text className="text-lg font-semibold text-slate-800">
                No opportunities yet
              </Text>

              <Text className="mt-2 text-center text-base text-slate-500">
                Start tracking jobs and internships you want to apply for.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <Pressable
            onPress={() => void handleLogout()}
            className="mt-8 items-center rounded-xl bg-red-500 py-4"
          >
            <Text className="text-base font-semibold text-white">Log out</Text>
          </Pressable>
        }
      />
    </View>
  );
}
