import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const reminders = [
  {
    id: 1,
    time: "8:00 AM",
    title: "Thyronorm",
    message: "Time to take your morning dose.",
  },
  {
    id: 2,
    time: "4:00 PM",
    title: "Paracetamol",
    message: "Scheduled for the afternoon.",
  },
  {
    id: 3,
    time: "10:00 PM",
    title: "Vitamin D",
    message: "Don’t forget your night supplement.",
  },
];

export default function ReminderScreen() {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>💡 Reminders</Text>
        <Modal transparent visible={loading} animationType="fade">
          <View style={styles.modalOverlay}>
            <ActivityIndicator size="large" color="#734BD1" />
          </View>
        </Modal>
        {reminders.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.name}>💊 {item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFF",
  },
  scroll: {
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 20,
    marginTop: 20,
  },
  subHeader: {
    fontSize: 15,
    color: "#777",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E3F3",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flex: 1,
    paddingRight: 10,
  },
  time: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7B47F5",
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1E1E1E",
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: "#555",
  },
  cardRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    alignSelf: "center",
  },
  statusTaken: {
    color: "#28C76F",
    fontSize: 13,
    fontWeight: "600",
  },
  takeBtn: {
    backgroundColor: "#7B47F5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  takeBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
