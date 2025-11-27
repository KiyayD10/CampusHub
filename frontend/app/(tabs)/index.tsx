import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";
import { Link, type Href } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { api } from "@/hooks/useAPI";

type Task = {
  id: string;
  title: string;
  course?: string;
  due?: string;
  status: "todo" | "doing" | "done";
};

/* -------------------------------------------------------------------------- */
/*                         AnimatedActionCard Component                       */
/* -------------------------------------------------------------------------- */
function AnimatedActionCard({
  icon,
  label,
  color,
  href,
  style,
}: {
  icon: string;
  label: string;
  color: string;
  href: Href;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Link href={href} asChild>
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.94))}
        onPressOut={() => (scale.value = withSpring(1))}
      >
        <Animated.View style={[styles.actionCard, style, animatedStyle]}>
          <Ionicons name={icon as any} size={28} color={color} />
          <Text style={styles.cardLabel}>{label}</Text>
        </Animated.View>
      </Pressable>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*                               HomeScreen                                  */
/* -------------------------------------------------------------------------- */
export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate card width dynamically
  // Padding: 16 * 2 = 32
  // Gap between cards: 12 * 2 = 24
  // Total occupied width excluding cards = 56
  const GAP = 12;
  const PADDING = 16;
  const availableWidth = width - (PADDING * 2) - (GAP * 2);
  const cardWidth = availableWidth / 3;
  const cardHeight = cardWidth * 1.1;

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/api/tasks?today=1", { method: "GET" });
        setTodayTasks(data?.items ?? []);
      } catch {
        setTodayTasks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.page}>
      <Header title="CampusHub" />

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Greeting with Icon & Animation */}
        <Animated.View
          entering={FadeInRight.springify().delay(100)}
          style={styles.greetRow}
        >
          <Ionicons name="school-outline" size={28} color="#6D28D9" />
          <Text style={styles.greet}>Welcome back</Text>
        </Animated.View>
        <Text style={styles.subtitle}>
          Stay productive and manage your campus life easily.
        </Text>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInUp.delay(200)}
          style={[styles.actionsContainer, { gap: GAP }]}
        >
          <AnimatedActionCard
            icon="qr-code-outline"
            label="Scan QR"
            color="#6D28D9"
            href={"/(tabs)/attendance" as const}
            style={{ width: cardWidth, height: cardHeight }}
          />
          <AnimatedActionCard
            icon="clipboard-outline"
            label="Tasks"
            color="#6D28D9"
            href={"/(tabs)/tasks" as const}
            style={{ width: cardWidth, height: cardHeight }}
          />
          <AnimatedActionCard
            icon="megaphone-outline"
            label="Report"
            color="#6D28D9"
            href={"/(tabs)/reports" as const}
            style={{ width: cardWidth, height: cardHeight }}
          />
        </Animated.View>

        {/* Task Section */}
        <Text style={styles.section}>Today’s Tasks</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator animating color="#6D28D9" size="large" />
            <Text style={styles.loadingText}>Loading your tasks...</Text>
          </View>
        ) : todayTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar-outline" size={40} color="#6D28D9" />
            </View>
            <Text style={styles.emptyText}>No tasks for today</Text>
            <Text style={styles.emptySub}>
              You’re all caught up! Check back later or add a new task.
            </Text>
          </View>
        ) : (
          todayTasks.map((t, i) => (
            <Animated.View
              key={t.id}
              entering={FadeInDown.delay(i * 120)}
              style={{ marginBottom: 10 }}
            >
              <TaskCard
                title={t.title}
                course={t.course}
                due={t.due}
                status={t.status}
              />
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F3F4F6" },
  body: { padding: 16 },

  // Greeting
  greetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  greet: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.3,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 24,
  },

  // Actions
  actionsContainer: {
    flexDirection: "row",
    // justifyContent: "space-between", // Removed in favor of gap
    marginBottom: 30,
  },
  actionCard: {
    // Width and Height are now dynamic
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6D28D9",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(109,40,217,0.1)",
    // backdropFilter: "blur(10px)", // Removed as it's not standard RN
  },
  cardLabel: {
    marginTop: 6,
    fontWeight: "700",
    color: "#111827",
    fontSize: 13,
  },

  // Section
  section: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  // Loading
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  loadingText: { color: "#6B7280", marginTop: 8 },

  // Empty state modern
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(109,40,217,0.08)",
  },
  emptyIconCircle: {
    backgroundColor: "rgba(109,40,217,0.1)",
    borderRadius: 999,
    padding: 14,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
  },
  emptySub: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    maxWidth: 260,
  },
});
