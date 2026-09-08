import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-600">
      <Text className="text-3xl font-bold text-white">ApplyTMRW 🚀</Text>

      <Text className="mt-3 text-base text-blue-100">
        NativeWind is working!
      </Text>
    </View>
  );
}
