import database from "@react-native-firebase/database";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PrescriptionScreen() {
  const navigation = useNavigation();
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

const prescriptions = Object.entries(items).map(
  ([id, prescription]) => ({
    id,
    ...prescription,
    hospital: prescription.hospital,
    doctor: prescription.doctor,
    disease: prescription.patientInfo.diagnosis
  })
);

  const renderPrescription = ({ item }) => (
    <TouchableOpacity
      style={styles.prescriptionCard}
      onPress={() =>
        navigation.navigate("PrescriptionDetails", { prescription: item })
      }
    >
      <Text allowFontScaling={false} style={styles.cardTitle}>{item.disease}</Text>
      <View style={styles.cardInfoRow}>
        <Text allowFontScaling={false} style={styles.cardLabel}>🏥 {item.hospital}</Text>
        <Text allowFontScaling={false} style={styles.cardLabel}>👨‍⚕️ Dr. {item.doctor}</Text>
      </View>
      <Text allowFontScaling={false} style={styles.cardFooterText}>Tap to view details ⬇️</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.title}>Your Prescriptions</Text>
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
