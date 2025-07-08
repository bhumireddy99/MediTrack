import database from "@react-native-firebase/database";
import { useEffect, useState } from "react";
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
    title: "Thyronorm",
    message: "Time to take your morning dose.",
  },
  {
    id: 2,
    title: "Paracetamol",
    message: "Scheduled for the afternoon.",
  },
  {
    id: 3,
    title: "Vitamin D",
    message: "Don’t forget your night supplement.",
  },
];

export default function ReminderScreen() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState({});

  useEffect(() => {
    const onValueChange = database()
      .ref("/patientRecords/Susan")
      .on("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const parsed = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setItems(parsed);
        } else {
          setItems([]);
        }
      });

    return () => {
      database().ref("/patientRecords").off("value", onValueChange);
    };
  }, []);

  let reminders = [];
  let idCounter = 1;

  Object.entries(items).forEach(([key, prescription]) => {
    const doctor = prescription.doctor;
    const hospital = prescription.hospital;

    // Reminder: New prescription
    reminders.push({
      id: `reminder${idCounter++}`,
      title: "💊 🆕 New prescription added",
      message: `Prescription added by Dr. ${doctor} at ${hospital} on ${prescription.date}`,
    });

    // Reminder: Follow-up (if required)
    const followUp = prescription.followUpDetails;
    if (followUp?.followUpRequired === "Yes" && followUp.followUpDate) {
      reminders.push({
        id: `reminder${idCounter++}`,
        title: "🔁 📅 Follow-up reminder",
        message: `Follow-up scheduled by Dr. ${doctor} at ${hospital} on ${followUp.followUpDate}`,
      });
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text allowFontScaling={false} style={styles.header}>💡 Reminders</Text>
        <Modal transparent visible={loading} animationType="fade">
          <View style={styles.modalOverlay}>
            <ActivityIndicator size="large" color="#734BD1" />
          </View>
        </Modal>
        {reminders.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <Text allowFontScaling={false} style={styles.name}>{item.title}</Text>
              <Text allowFontScaling={false} style={styles.message}>{item.message}</Text>
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
