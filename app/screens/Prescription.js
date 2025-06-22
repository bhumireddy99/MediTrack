import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const prescriptions = [
  {
    id: "1",
    hospital: "CityCare Hospital",
    doctor: "Dr. Smith",
    disease: "General Illness",
    medicines: [
      {
        name: "Paracetamol",
        mg: "500mg",
        frequency: "3 times a day",
        duration: "5 days",
        schedule: "08:00 AM, 2:00 PM, 8:00 PM",
        how: "After food with water",
        usage: "Reduce fever and relieve mild pain",
        sideEffects: "Nausea, rash, liver issues if overused",
        precautions: "Avoid alcohol, follow dosage strictly",
      },
      {
        name: "Amoxicillin",
        mg: "500mg",
        frequency: "3 times a day",
        duration: "7 days",
        schedule: "08:00 AM, 2:00 PM, 8:00 PM",
        how: "After meals",
        usage: "Treats bacterial infections",
        sideEffects: "Nausea, diarrhea",
        precautions: "Avoid alcohol, complete full course",
      },
      {
        name: "Ibuprofen",
        mg: "400mg",
        frequency: "2 times a day",
        duration: "5 days",
        schedule: "10:00 AM, 8:00 PM",
        how: "After food",
        usage: "Pain relief and inflammation",
        sideEffects: "Upset stomach, dizziness",
        precautions: "Avoid on empty stomach",
      },
      {
        name: "Cetrizine",
        mg: "10mg",
        frequency: "Once a day",
        duration: "7 days",
        schedule: "09:00 PM",
        how: "With or without food",
        usage: "Relieves allergy symptoms",
        sideEffects: "Drowsiness",
        precautions: "Avoid driving after taking",
      },
      {
        name: "Omeprazole",
        mg: "20mg",
        frequency: "Once a day",
        duration: "14 days",
        schedule: "Before breakfast",
        how: "Empty stomach",
        usage: "Reduces stomach acid",
        sideEffects: "Headache, nausea",
        precautions: "Avoid alcohol",
      },
    ],
  },
  // ... Keep your other prescriptions as is
];

export default function PrescriptionScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const renderPrescription = ({ item }) => (
    <TouchableOpacity
      style={styles.prescriptionCard}
      onPress={() =>
        navigation.navigate("PrescriptionDetails", { prescription: item })
      }
    >
      <Text style={styles.cardTitle}>{item.disease}</Text>
      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>🏥 {item.hospital}</Text>
        <Text style={styles.cardLabel}>👨‍⚕️ {item.doctor}</Text>
      </View>
      <Text style={styles.cardFooterText}>Tap to view details ⬇️</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Prescriptions</Text>
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.modalOverlay}>
          <ActivityIndicator size="large" color="#734BD1" />
        </View>
      </Modal>
      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id}
        renderItem={renderPrescription}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const purple = "#9B59B6";
const lightPurple = "#f4ebfa";
const white = "#ffffff";
const darkText = "#333";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 20,
    marginTop: 20,
  },
  prescriptionCard: {
    backgroundColor: lightPurple,
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6C3483",
    marginBottom: 8,
  },
  cardInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 14,
    color: "#5D3A9B",
    fontWeight: "500",
  },
  cardFooterText: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
