import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { api } from "@/hooks/useAPI";
import { useTheme } from "../../context/ThemeContext";

export default function AttendanceScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasLocPerm, setHasLocPerm] = useState<boolean | null>(null);
  const [loc, setLoc] = useState<Location.LocationObject | null>(null);
  const [scanned, setScanned] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Request location permission
      const locPerm = await Location.requestForegroundPermissionsAsync();

      if (!mounted) return;
      setHasLocPerm(locPerm.status === "granted");

      // Get position once
      if (locPerm.status === "granted") {
        const current = await Location.getCurrentPositionAsync({
          accuracy:
            Platform.select({ ios: Location.Accuracy.Low, android: Location.Accuracy.Balanced }) ??
            Location.Accuracy.Balanced,
        });
        if (mounted) setLoc(current);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onScan = useCallback(
    async ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);
      try {
        const payload = {
          qr: data,
          lat: loc?.coords.latitude ?? null,
          lng: loc?.coords.longitude ?? null,
        };
        await api("/api/attendance/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        Alert.alert("Success", "Attendance recorded!");
      } catch (e: any) {
        Alert.alert("Failed", e?.message || "Could not submit attendance");
      } finally {
        setTimeout(() => setScanned(false), 1000);
      }
    },
    [scanned, loc]
  );

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={[styles.page, { backgroundColor: theme.colors.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.message, { color: theme.colors.text }]}>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission} style={[styles.btn, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: "#000" }]} edges={['top']}>
      <View style={styles.scannerWrap}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : onScan}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />

        {/* Mask gelap */}
        <View pointerEvents="none" style={styles.mask} />
        {/* Frame kotak */}
        <View pointerEvents="none" style={styles.frame} />

        {/* Overlay info */}
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Align QR inside the frame</Text>
          {hasLocPerm === false ? (
            <Text style={styles.overlaySub}>Location permission denied</Text>
          ) : loc ? (
            <Text style={styles.overlaySub}>
              GPS: {loc.coords.latitude.toFixed(5)}, {loc.coords.longitude.toFixed(5)}
            </Text>
          ) : (
            <Text style={styles.overlaySub}>Getting location…</Text>
          )}

          <Pressable style={[styles.btn, { backgroundColor: theme.colors.card }]} onPress={() => setScanned(false)}>
            <Text style={[styles.btnText, { color: theme.colors.text }]}>{scanned ? "Ready…" : "Rescan"}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const FRAME_SIZE = 260;

const styles = StyleSheet.create({
  page: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  message: { textAlign: 'center', paddingBottom: 10 },
  scannerWrap: { flex: 1 },
  // Mask semi-transparan
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  // Kotak frame di tengah
  frame: {
    position: "absolute",
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    top: "35%",
    left: "50%",
    marginLeft: -FRAME_SIZE / 2,
    marginTop: -FRAME_SIZE / 2,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    gap: 8,
  },
  overlayText: { color: "white", fontWeight: "800" },
  overlaySub: { color: "#e5e7eb" },
  muted: { color: "#9ca3af", marginTop: 6 },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  btnText: { fontWeight: "700" },
});
