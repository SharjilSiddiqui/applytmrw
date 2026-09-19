import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/contexts/auth-context";

export default function AccountScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="px-5 pb-10 pt-12">
        {/* Header */}
        <Text className="text-sm font-bold uppercase tracking-widest text-brand-600">
          ApplyTMRW
        </Text>

        <Text className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          Your account.
        </Text>

        <Text className="mt-3 text-base leading-6 text-slate-500">
          Keep your profile details and account access in one place.
        </Text>

        {/* Profile card */}
        <View className="mt-8 rounded-3xl bg-brand-500 p-6">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Text className="text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </Text>
          </View>

          <Text className="mt-5 text-2xl font-bold text-white">
            {user?.name ?? "Job seeker"}
          </Text>

          <Text className="mt-1 text-base text-orange-50">
            {user?.email ?? "No email available"}
          </Text>
        </View>

        {/* Account details */}
        <View className="mt-5 overflow-hidden rounded-3xl border border-slate-100 bg-white">
          <View className="border-b border-slate-100 px-5 py-5">
            <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Name
            </Text>

            <Text className="mt-2 text-base font-semibold text-slate-950">
              {user?.name ?? "Job seeker"}
            </Text>
          </View>

          <View className="px-5 py-5">
            <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Email
            </Text>

            <Text className="mt-2 text-base font-semibold text-slate-950">
              {user?.email ?? "No email available"}
            </Text>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          onPress={() => void handleLogout()}
          className="mt-6 items-center rounded-2xl border border-red-100 bg-white py-4 active:bg-red-50"
        >
          <Text className="text-base font-bold text-red-600">Log out</Text>
        </Pressable>
      </View>
    </View>
  );
}
