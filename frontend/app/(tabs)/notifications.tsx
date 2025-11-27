import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Empty from "@/components/Empty";
import { api } from "@/hooks/useAPI";

type Notif = { id: string; title: string; body?: string; createdAt: string; read?: boolean };

export default function NotificationsScreen() {
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await api("/api/notifications", { method: "GET" });
      setItems(data?.items ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const markRead = async (id: string) => {
    await api(`/api/notifications/${id}/read`, { method: "POST" });
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <View style={styles.body}>
        {loading ? <Text style={{ color: "#6b7280" }}>Loading...</Text> :
          items.length === 0 ? <Empty message="No notifications." /> :
            <FlatList
              data={items}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <Pressable onPress={() => markRead(item.id)} style={[styles.card, item.read && { opacity: 0.6 }]}>
                  <Text style={styles.title}>{item.title}</Text>
                  {!!item.body && <Text style={styles.bodyText}>{item.body}</Text>}
                  <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
                </Pressable>
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f3f4f6" },
  body: { padding: 16, flex: 1 },
  card: { backgroundColor: "white", padding: 14, borderRadius: 14, marginBottom: 12 },
  title: { fontWeight: "800", fontSize: 15, color: "#111827" },
  bodyText: { marginTop: 6, color: "#374151" },
  time: { marginTop: 8, color: "#6b7280", fontSize: 12 }
});
