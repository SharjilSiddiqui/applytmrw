import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";

import { useAuth } from "@/contexts/auth-context";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await login({
        email: email.trim().toLowerCase(),
        password,
      });

      router.replace("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.";

      Alert.alert("Login failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-center px-6">
        <View className="w-full max-w-xl self-center">
          {/* Brand */}
          <View className="mb-10">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-brand-500">
              <Text className="text-2xl font-extrabold text-white">A</Text>
            </View>

            <Text className="mt-7 text-sm font-bold uppercase tracking-widest text-brand-600">
              ApplyTMRW
            </Text>

            <Text className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              Welcome back.
            </Text>

            <Text className="mt-3 max-w-md text-base leading-6 text-slate-500">
              Pick up where you left off and keep your next opportunities
              moving.
            </Text>
          </View>

          {/* Form */}
          <View className="rounded-3xl border border-slate-100 bg-white p-5">
            <View className="gap-5">
              <View>
                <Text className="mb-2.5 text-sm font-semibold text-slate-800">
                  Email
                </Text>

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSubmitting}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-950"
                />
              </View>

              <View>
                <Text className="mb-2.5 text-sm font-semibold text-slate-800">
                  Password
                </Text>

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  editable={!isSubmitting}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-950"
                />
              </View>

              <Pressable
                onPress={handleLogin}
                disabled={isSubmitting}
                className={`mt-1 items-center rounded-2xl py-4 ${
                  isSubmitting
                    ? "bg-brand-300"
                    : "bg-brand-500 active:bg-brand-600"
                }`}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-bold text-white">Log in</Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* Register */}
          <View className="mt-7 flex-row justify-center">
            <Text className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
            </Text>

            <Link href="/register" asChild>
              <Pressable>
                <Text className="text-sm font-bold text-brand-600">
                  Create one
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
