import { View, Text, StyleSheet, Pressable } from "react-native";

type Props = {
  title: string;
  course?: string;
  due?: string;
  status?: "todo" | "doing" | "done";
  onPress?: () => void;
};

export default function TaskCard({ title, course, due, status = "todo", onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({pressed}) => [styles.card, pressed && {opacity:0.8}]}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, badgeColor(status)]}>
          <Text style={styles.badgeText}>{status.toUpperCase()}</Text>
        </View>
      </View>
      {course ? <Text style={styles.sub}>{course}</Text> : null}
      {due ? <Text style={styles.due}>Due: {new Date(due).toLocaleString()}</Text> : null}
    </Pressable>
  );
}

const badgeColor = (s: Props["status"]) => {
  switch (s) {
    case "done": return { backgroundColor: "#10b981" };
    case "doing": return { backgroundColor: "#f59e0b" };
    default: return { backgroundColor: "#3b82f6" };
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  sub: { marginTop: 4, color: "#6b7280" },
  due: { marginTop: 8, color: "#374151", fontSize: 12 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: "white", fontWeight: "700", fontSize: 10 },
});
