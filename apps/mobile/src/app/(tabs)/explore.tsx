import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

const categories = [
  {
    title: "Frontend",
    subtitle: "React, Next.js, Vue",
    icon: "</>",
  },
  {
    title: "Backend",
    subtitle: "Node.js, Python, Java",
    icon: "{ }",
  },
  {
    title: "AI & Data",
    subtitle: "AI, ML, Data Science",
    icon: "AI",
  },
  {
    title: "Internships",
    subtitle: "Early-career opportunities",
    icon: "↗",
  },
];

export default function ExploreScreen() {
  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 48,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View>
        <Text className="text-sm font-bold uppercase tracking-widest text-brand-600">
          ApplyTMRW
        </Text>

        <Text className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Explore.
        </Text>

        <Text className="mt-3 max-w-85 text-base leading-6 text-slate-500">
          Find opportunities worth saving today and applying to tomorrow.
        </Text>
      </View>

      {/* Quick save card */}
      <View className="mt-8 overflow-hidden rounded-3xl bg-brand-500 p-6">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
          <Text className="text-xl font-bold text-white">+</Text>
        </View>

        <Text className="mt-5 text-2xl font-bold text-white">
          Found something interesting?
        </Text>

        <Text className="mt-2 text-sm leading-5 text-orange-50">
          Save the opportunity now. We&apos;ll help you remember to apply when
          tomorrow comes.
        </Text>

        <Pressable
          onPress={() => router.push("/create-opportunity")}
          className="mt-5 self-start rounded-xl bg-white px-5 py-3 active:bg-orange-50"
        >
          <Text className="font-bold text-brand-600">Save an opportunity</Text>
        </Pressable>
      </View>

      {/* Categories */}
      <View className="mt-10">
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-xl font-bold text-slate-900">
              Browse by category
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Find the kind of role you&apos;re looking for.
            </Text>
          </View>
        </View>

        <View className="mt-5 gap-3">
          {categories.map((category) => (
            <Pressable
              key={category.title}
              onPress={() => router.push("/create-opportunity")}
              className="rounded-2xl border border-slate-200 bg-white p-5 active:bg-brand-50"
            >
              <View className="flex-row items-center">
                {/* Category icon */}
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-100">
                  <Text className="text-sm font-bold text-brand-600">
                    {category.icon}
                  </Text>
                </View>

                {/* Content */}
                <View className="ml-4 flex-1">
                  <Text className="text-base font-bold text-slate-900">
                    {category.title}
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    {category.subtitle}
                  </Text>
                </View>

                {/* Arrow */}
                <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-slate-50">
                  <Text className="text-lg text-slate-500">→</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Philosophy */}
      <View className="mt-10 rounded-3xl border border-brand-200 bg-brand-50 p-6">
        <Text className="text-lg font-bold text-slate-900">
          Don&apos;t lose the opportunity.
        </Text>

        <Text className="mt-2 text-sm leading-5 text-slate-600">
          You don&apos;t need to apply the moment you discover a great job. Save
          it, come back tomorrow, and apply when you&apos;re ready.
        </Text>

        <View className="mt-5 flex-row items-center">
          <View className="h-2 w-2 rounded-full bg-brand-500" />

          <Text className="ml-2 text-sm font-semibold text-brand-700">
            Save today. Apply tomorrow.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
