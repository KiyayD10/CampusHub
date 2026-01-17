import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header({ title }: { title: string }) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.wrap}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: "#111827" },
  wrap: { paddingHorizontal: 16, paddingBottom: 10, paddingTop: 4 },
  title: { color: "white", fontSize: 20, fontWeight: "700" },
});
