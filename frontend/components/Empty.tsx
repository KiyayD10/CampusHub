import { View, Text, StyleSheet } from "react-native";

export default function Empty({ message }: { message: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 16, alignItems: "center" },
  text: { color: "#6b7280" },
});
