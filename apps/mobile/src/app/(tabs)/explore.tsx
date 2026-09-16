import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

const categories = [
  {
    title: "Frontend",
    subtitle: "React, Next.js, Vue",
  },
  {
    title: "Backend",
    subtitle: "Node.js, Python, Java",
  },
  {
    title: "AI & Data",
    subtitle: "AI, ML, Data Science",
  },
  {
    title: "Internships",
    subtitle: "Early-career opportunities",
  },
];

export default function ExploreScreen() {
  return (
    <ScrollView
      className="flex-1 bg-[#FFFCFA]"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 48,
      }}
    >
      <Text className="text-4xl font-bold text-slate-900">Explore</Text>

      <Text className="mt-3 text-base leading-6 text-slate-500">
        Discover opportunities worth saving for tomorrow.
      </Text>

      <View className="mt-10">
        <Text className="text-lg font-bold text-slate-900">
          Browse categories
        </Text>

        <View className="mt-4 gap-3">
          {categories.map((category) => (
            <Pressable
              key={category.title}
              onPress={() => router.push("/create-opportunity")}
              className="rounded-2xl border border-slate-200 bg-white p-5 active:bg-brand-50"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold text-slate-900">
                    {category.title}
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    {category.subtitle}
                  </Text>
                </View>

                <View className="ml-4 h-10 w-10 items-center justify-center rounded-full bg-brand-100">
                  <Text className="text-lg text-brand-600">→</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-10 rounded-3xl bg-brand-500 p-6">
        <Text className="text-2xl font-bold text-white">
          Found a job you like?
        </Text>

        <Text className="mt-2 text-sm leading-5 text-orange-50">
          Save it now and let ApplyTMRW remind you to apply tomorrow.
        </Text>

        <Pressable
          onPress={() => router.push("/create-opportunity")}
          className="mt-5 self-start rounded-xl bg-white px-5 py-3 active:bg-orange-50"
        >
          <Text className="font-bold text-brand-600">Save an opportunity</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
