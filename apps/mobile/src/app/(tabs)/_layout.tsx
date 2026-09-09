import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import AppTabs from "@/components/app-tabs";
import { useAuth } from "@/contexts/auth-context";

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <AppTabs />;
}
