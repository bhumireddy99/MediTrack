import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import RenderHTML from "react-native-render-html";

const { width, height } = Dimensions.get("window");

export default function PrescriptionDetailScreen({ route }) {
  const { prescription } = route.params;
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const openModal = (medicine) => {
    setSelectedMedicine(medicine);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedMedicine(null);
    setModalVisible(false);
  };

  const renderMedicineInfo = (medicines) => {
    return medicines.map((med, index) => {
      // Determine frequency
      let frequency = "";
      const isArrayOfArrays = Array.isArray(med.taken[0]); // Check structure

      if (isArrayOfArrays) {
        const timesPerDay = med.taken[0].length;
        frequency = `${timesPerDay} time${timesPerDay > 1 ? "s" : ""} a day`;
      } else {
        frequency = `${med.timeOfConsumption.length} time${
          med.timeOfConsumption.length > 1 ? "s" : ""
        } a day`;
      }

      // Combine timeOfConsumption + consumption
      const whenToTake = med.timeOfConsumption
        .map((time) => `${time} ${med.consumption}`)
        .join(", ");

      return {
        medicineName: med.medicineName,
        dosage: med.dosage,
        frequency,
        whenToTake,
        duration: med.duration,
        instructions: med.instructions,
      };
    });
  };

  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.header}>Prescription Overview</Text>
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.modalOverlaySpinner}>
          <ActivityIndicator size="large" color="#734BD1" />
        </View>
      </Modal>
      <View style={styles.cardTop}>
        <View>
          <Text allowFontScaling={false} style={styles.diseaseText}>{prescription.disease}</Text>
          <Text allowFontScaling={false} style={styles.metaText}>👨‍⚕️ Dr. {prescription.doctor}</Text>
          <Text allowFontScaling={false} style={styles.metaText}>🏥 {prescription.hospital}</Text>
        </View>
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 10,
            height: 40,
          }}
        >
          <Text
            style={{
              height: "100%",
              width: "100%",
              color: "white",
              fontWeight: "bold",
              padding: 10,
            }}
            onPress={() => {
              navigation.navigate("PrescriptionView", { prescription: prescription })
            }}
          >
            View Prescription
          </Text>
        </View>
      </View>

      <Text allowFontScaling={false} style={styles.sectionTitle}>Medicines</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {renderMedicineInfo(prescription.medicines).map((med, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.medicineCard}
            onPress={() => openModal(med)}
          >
            <View style={styles.medicineInfo}>
              <Ionicons
                name="medkit-outline"
                size={20}
                color={colors.primary}
              />
              <Text allowFontScaling={false} style={styles.medicineName}>{med.medicineName}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            style={styles.modalCardWrapper}
          >
            <View style={styles.modalContent}>
              <Text allowFontScaling={false} style={styles.modalHeader}>
                {selectedMedicine?.medicineName}
              </Text>

              <ScrollView
                style={styles.modalScroll}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalItemBox}>
                  <Text allowFontScaling={false} style={styles.modalLabel}>💊 Dosage:</Text>
                  <Text allowFontScaling={false} style={styles.modalValue}>
                    {selectedMedicine?.dosage}
                  </Text>
                </View>
                <View style={styles.modalItemBox}>
                  <Text allowFontScaling={false} style={styles.modalLabel}>📆 Frequency:</Text>
                  <Text allowFontScaling={false} style={styles.modalValue}>
                    {selectedMedicine?.frequency}
                  </Text>
                </View>
                <View style={styles.modalItemBox}>
                  <Text allowFontScaling={false} style={styles.modalLabel}>⏳ Duration:</Text>
                  <Text allowFontScaling={false} style={styles.modalValue}>
                    {selectedMedicine?.duration} days
                  </Text>
                </View>
                <View style={styles.modalItemBox}>
                  <Text allowFontScaling={false} style={styles.modalLabel}>🕒 Schedule:</Text>
                  <Text allowFontScaling={false} style={styles.modalValue}>
                    {selectedMedicine?.whenToTake}
                  </Text>
                </View>
                <View style={styles.modalItemBox}>
                  <Text allowFontScaling={false} style={styles.modalLabel}>💡 How to Take:</Text>
                  <Text allowFontScaling={false} style={styles.modalValue}>
                    {selectedMedicine?.instructions}
                  </Text>
                </View>
                {/* <View style={styles.modalItemBox}>
                  <Text allowFontScaling={false} style={styles.modalLabel}>📋 Usage:</Text>
                  <Text allowFontScaling={false} style={styles.modalValue}>
                    {selectedMedicine?.usage}
                  </Text>
                </View> */}
                {/* <View style={styles.modalItemBox}>
                  <Text allowFontScaling={false} style={styles.modalLabel}>⚠️ Side Effects:</Text>
                  <Text allowFontScaling={false} style={styles.modalValue}>
                    {selectedMedicine?.sideEffects}
                  </Text>
                </View> */}
                <View style={styles.modalItemBox}>
                  <Text allowFontScaling={false} style={styles.modalLabel}>🛑 Precautions:</Text>
                  <Text allowFontScaling={false} style={styles.modalValue}>Avoid alcohol</Text>
                </View>
              </ScrollView>

              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Text allowFontScaling={false} style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={prescriptionModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={[colors.overlay2, colors.overlay2]}
            style={styles.modalCardWrapper}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "bold",
                textAlign: "right",
                padding: 20,
              }}
              onPress={() => {
                setPrescriptionModalVisible(false);
              }}
            >
              X
            </Text>
            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
              <RenderHTML contentWidth={width} source={source} />
            </View>
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: 10,
                height: 40,
                width: "70%",
                marginLeft: "15%",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  height: "100%",
                  width: "100%",
                  color: "white",
                  fontWeight: "bold",
                  paddingVertical: 10,
                  paddingLeft: 85,
                }}
                onPress={() => {
                  prescriptionDowload();
                }}
              >
                Download PDF
              </Text>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const colors = {
  background: "#F5F7FA",
  card: "#FFFFFF",
  primary: "#6C5CE7",
  accent: "#A29BFE",
  text: "#2D3436",
  muted: "#636e72",
  overlay: "rgba(0,0,0,0.4)",
  overlay2: "white",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  cardTop: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  diseaseText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 14,
    color: colors.muted,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
  },
  scrollView: {
    paddingBottom: 20,
  },
  medicineCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  medicineInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay2: {
    flex: 1,
    backgroundColor: colors.overlay2,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCardWrapper: {
    width: width * 0.9,
    borderRadius: 24,
    padding: 2,
  },
  modalCardWrapper2: { width: width * 0.9, borderRadius: 24, padding: 2 },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 20,
    maxHeight: height * 0.75,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 14,
    textAlign: "center",
  },
  modalScroll: {
    marginBottom: 16,
  },
  modalItemBox: {
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
  modalValue: {
    fontSize: 15,
    marginLeft: 18,
    color: colors.text,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlaySpinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
