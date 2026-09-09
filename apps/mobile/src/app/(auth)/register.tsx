import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";

import { useAuth } from "@/contexts/auth-context";

export default function RegisterScreen() {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password.",
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
    <View className="flex-1 justify-center bg-white px-6">
      <View className="mb-10">
        <Text className="text-4xl font-bold text-slate-900">
          Create account
        </Text>

        <Text className="mt-3 text-base text-slate-500">
          Start tracking your job opportunities with ApplyTMRW.
        </Text>
      </View>

      <View className="gap-5">
        <View>
          <Text className="mb-2 text-sm font-medium text-slate-700">Email</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
            className="rounded-xl border border-slate-300 px-4 py-4 text-base text-slate-900"
          />
        </View>

        <View>
          <Text className="mb-2 text-sm font-medium text-slate-700">
            Password
          </Text>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            secureTextEntry
            editable={!isSubmitting}
            className="rounded-xl border border-slate-300 px-4 py-4 text-base text-slate-900"
          />
        </View>

        <Pressable
          onPress={handleRegister}
          disabled={isSubmitting}
          className="mt-2 items-center rounded-xl bg-blue-600 py-4 active:bg-blue-700"
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-semibold text-white">
              Create account
            </Text>
          )}
        </Pressable>
      </View>

      <View className="mt-8 flex-row justify-center">
        <Text className="text-slate-500">Already have an account? </Text>

        <Link href="/login" asChild>
          <Pressable>
            <Text className="font-semibold text-blue-600">Log in</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
