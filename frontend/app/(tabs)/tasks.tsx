import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { api } from "@/hooks/useAPI";
import { useDebounce } from "@/hooks/useDebounce";

type Task = {
  id: string;
  title: string;
  course?: string;
  due?: string;
  status: "todo" | "doing" | "done";
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [q, setQ] = useState("");
  const qd = useDebounce(q, 400);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const data = await api(`/api/tasks?q=${encodeURIComponent(qd)}`, {
        method: "GET",
      });
      setTasks(data?.items ?? []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [qd]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async () => {
    if (!title.trim()) return;
    try {
      const newT = await api("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      setTitle("");
      setTasks((x) => [newT, ...x]);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to create task");
    }
  };

  return (
    <View style={styles.page}>
      <Header title="Tasks" />

      <Animated.View entering={FadeInRight.delay(100)} style={styles.body}>
        {/* 🔍 Search Bar */}
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={22} color="#6B7280" />
          <TextInput
            placeholder="Search tasks..."
            style={styles.input}
            value={q}
            onChangeText={setQ}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* ➕ Add Task */}
        <View style={styles.addRow}>
          <TextInput
            placeholder="New task title..."
            style={[styles.input, { flex: 1 }]}
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9CA3AF"
          />
          <AnimatedAddButton onPress={createTask} />
        </View>

        {/* 📋 Task List / Empty / Loading */}
        {loading ? (
          <View style={styles.centerWrap}>
            <Ionicons
              name="hourglass-outline"
              size={42}
              color="#6D28D9"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.loadingText}>Loading your tasks...</Text>
          </View>
        ) : tasks.length === 0 ? (
          <View style={styles.centerWrap}>
            <Ionicons
              name="document-text-outline"
              size={42}
              color="#9CA3AF"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.emptyText}>No tasks found</Text>
            <Text style={styles.emptySub}>Add a new task to get started.</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(i) => i.id}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.delay(index * 100)}
                style={{ marginBottom: 10 }}
              >
                <TaskCard
                  title={item.title}
                  course={item.course}
                  due={item.due}
                  status={item.status}
                />
              </Animated.View>
            )}
            contentContainerStyle={{ paddingBottom: 60 }}
          />
        )}
      </Animated.View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                        Animated Add Button Component                       */
/* -------------------------------------------------------------------------- */
function AnimatedAddButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.9))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add task"
    >
      <Animated.View style={[styles.addBtn, animatedStyle]}>
        <Ionicons name="add" size={22} color="white" />
      </Animated.View>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F3F4F6" },
  body: { padding: 16, gap: 16, flex: 1 },

  // 🔍 Search Bar
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingLeft: 8,
    color: "#111827",
  },

  // ➕ Add Task
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  addBtn: {
    backgroundColor: "#6D28D9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#6D28D9",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  // 📋 List + Empty
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#374151",
  },
  emptySub: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
});
