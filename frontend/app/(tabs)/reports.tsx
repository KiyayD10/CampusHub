import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/hooks/useAPI";

type Report = {
  id: string;
  category: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
};

export default function ReportsScreen() {
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [list, setList] = useState<Report[]>([]);

  const submit = async () => {
    if (!category.trim() || !message.trim()) return;
    try {
      const data = await api("/api/reports", {
        method: "POST",
        body: JSON.stringify({ category, message }),
      });
      setList((x) => [data, ...x]);
      setCategory("");
      setMessage("");
      Alert.alert("✅ Sent", "Your report has been submitted.");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to submit report");
    }
  };

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <Animated.View entering={FadeInRight.springify().delay(100)} style={styles.body}>
        {/* 📝 Category Input */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.inputRow}>
          <Ionicons name="folder-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="e.g. Class issue, Facility, Academic..."
            value={category}
            onChangeText={setCategory}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* 💬 Message Input */}
        <Text style={styles.label}>Message</Text>
        <View style={[styles.inputRow, { alignItems: "flex-start" }]}>
          <Ionicons
            name="chatbox-ellipses-outline"
            size={20}
            color="#6B7280"
            style={{ marginTop: 10 }}
          />
          <TextInput
            placeholder="Describe your issue clearly..."
            value={message}
            onChangeText={setMessage}
            style={[styles.input, { height: 110, textAlignVertical: "top" }]}
            multiline
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <AnimatedSubmitButton onPress={submit} />

        {/* My Reports Section */}
        <Text style={styles.section}>My Reports</Text>

        {list.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="alert-circle-outline" size={44} color="#9CA3AF" />
            <Text style={styles.emptyText}>No reports yet</Text>
            <Text style={styles.emptySub}>All your submitted reports will appear here.</Text>
          </View>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(i) => i.id}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInDown.delay(index * 120)}>
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Ionicons name="document-text-outline" size={18} color="#6D28D9" />
                      <Text style={styles.itemTitle}>{item.category}</Text>
                    </View>
                    <Text style={[styles.status, statusColor(item.status)]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>

                  <Text style={styles.message}>{item.message}</Text>
                  <View style={styles.cardFooter}>
                    <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                    <Text style={styles.time}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}
            contentContainerStyle={{ paddingBottom: 70 }}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Animated Submit Button                            */
/* -------------------------------------------------------------------------- */
function AnimatedSubmitButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const styleAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.94))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
    >
      <Animated.View style={[styles.btn, styleAnim]}>
        <Ionicons name="send-outline" size={18} color="white" />
        <Text style={styles.btnText}>Submit Report</Text>
      </Animated.View>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Helper Styles                               */
/* -------------------------------------------------------------------------- */
const statusColor = (s: Report["status"]) => {
  switch (s) {
    case "resolved":
      return { color: "#10b981" };
    case "in_progress":
      return { color: "#f59e0b" };
    default:
      return { color: "#3b82f6" };
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F3F4F6" },
  body: { padding: 16, gap: 8, flex: 1 },

  label: { color: "#374151", fontWeight: "700", marginTop: 4 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    gap: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 6,
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6D28D9",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    marginTop: 10,
    gap: 6,
    shadowColor: "#6D28D9",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: { color: "white", fontWeight: "700", fontSize: 15 },

  section: {
    marginTop: 22,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: { fontWeight: "800", color: "#111827" },
  message: { color: "#374151", marginTop: 6, fontSize: 14 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  time: { color: "#9CA3AF", fontSize: 12 },
  status: { fontWeight: "800" },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: { fontWeight: "800", color: "#374151", fontSize: 16 },
  emptySub: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
    maxWidth: 250,
  },
});
