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

export default function RegisterScreen() {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your name, email, and password.",
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Password too short",
        "Your password must be at least 8 characters.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      router.replace("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.";

      Alert.alert("Registration failed", message);
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
              Start applying smarter.
            </Text>

            <Text className="mt-3 max-w-md text-base leading-6 text-slate-500">
              Save the opportunities you find today and stay ready to apply
              tomorrow.
            </Text>
          </View>

          {/* Form */}
          <View className="rounded-3xl border border-slate-100 bg-white p-5">
            <View className="gap-5">
              <View>
                <Text className="mb-2.5 text-sm font-semibold text-slate-800">
                  Name
                </Text>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isSubmitting}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-950"
                />
              </View>
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
                  placeholder="At least 8 characters"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  editable={!isSubmitting}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-950"
                />

                <Text className="mt-2 text-xs text-slate-400">
                  Use at least 8 characters for your password.
                </Text>
              </View>

              <Pressable
                onPress={handleRegister}
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
                  <Text className="text-base font-bold text-white">
                    Create account
                  </Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* Login */}
          <View className="mt-7 flex-row justify-center">
            <Text className="text-sm text-slate-500">
              Already have an account?{" "}
            </Text>

            <Link href="/login" asChild>
              <Pressable>
                <Text className="text-sm font-bold text-brand-600">Log in</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
