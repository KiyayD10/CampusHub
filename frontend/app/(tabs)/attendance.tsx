// app/(tabs)/attendance.tsx
import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { BarCodeScanner, type BarCodeScannerResult } from "expo-barcode-scanner";
import { api } from "@/hooks/useAPI";

export default function AttendanceScreen() {
  const [hasCamPerm, setHasCamPerm] = useState<boolean | null>(null);
  const [hasLocPerm, setHasLocPerm] = useState<boolean | null>(null);
  const [loc, setLoc] = useState<Location.LocationObject | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // minta izin kamera & lokasi
      const cam = await BarCodeScanner.requestPermissionsAsync();
      const locPerm = await Location.requestForegroundPermissionsAsync();

      if (!mounted) return;
      setHasCamPerm(cam.status === "granted");
      setHasLocPerm(locPerm.status === "granted");

      // ambil posisi sekali untuk ditampilkan & dikirim
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
    async ({ data }: BarCodeScannerResult) => {
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


  if (hasCamPerm === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission…</Text>
      </View>
    );
  }

  if (hasCamPerm === false) {
    return (
      <View style={styles.center}>
        <Text>No access to camera.</Text>
        <Text style={styles.muted}>Enable camera permission in Settings.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <View style={styles.scannerWrap}>
        <BarCodeScanner onBarCodeScanned={onScan} style={StyleSheet.absoluteFillObject} />

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

          <Pressable style={styles.btn} onPress={() => setScanned(false)}>
            <Text style={styles.btnText}>{scanned ? "Ready…" : "Rescan"}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const FRAME_SIZE = 260;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
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
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  btnText: { color: "white", fontWeight: "700" },
});
