import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function PrescriptionDetailScreen({ route }) {
  const { prescription } = route.params;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderMedicineInfo = (medicines) => {
    return medicines.map((med, index) => {
      let frequency = "";
      const isArrayOfArrays = Array.isArray(med.taken[0]);

      if (isArrayOfArrays) {
        const timesPerDay = med.taken[0].length;
        frequency = `${timesPerDay} time${timesPerDay > 1 ? "s" : ""} a day`;
      } else {
        frequency = `${med.timeOfConsumption.length} time${
          med.timeOfConsumption.length > 1 ? "s" : ""
        } a day`;
      }

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

  const getStatusColor = () => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Animated Background Gradient */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.backgroundGradient}
      />

      {/* Header Section */}
      <Animated.View
        style={[
          styles.headerSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Prescription</Text>
          <Text style={styles.headerSubtitle}>Medical Details</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="medical" size={28} color="#fff" />
        </View>
      </Animated.View>

      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.modalOverlaySpinner}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Prescription Overview Card */}
        <Animated.View
          style={[
            styles.overviewCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
            style={styles.glassCard}
          >
            <View style={styles.overviewHeader}>
              <View style={styles.diseaseContainer}>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor() },
                  ]}
                />
                <Text style={styles.diseaseText}>{prescription.disease}</Text>
              </View>
              <View style={styles.doctorInfo}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="person-circle" size={40} color="#667eea" />
                </View>
                <View style={styles.doctorDetails}>
                  <Text style={styles.doctorName}>
                    Dr. {prescription.doctor}
                  </Text>
                  <Text style={styles.hospitalName}>
                    {prescription.hospital}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewPrescriptionButton}
              onPress={() =>
                navigation.navigate("PrescriptionView", {
                  prescription: prescription,
                })
              }
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.buttonGradient}
              >
                <Ionicons name="document-text" size={20} color="#fff" />
                <Text style={styles.buttonText}>View Full Prescription</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Medicines Section */}
        <Animated.View
          style={[
            styles.medicinesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="medkit" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Medications</Text>
            <Text style={styles.medicineCount}>
              {prescription.medicines.length} medicine
              {prescription.medicines.length > 1 ? "s" : ""}
            </Text>
          </View>

          {renderMedicineInfo(prescription.medicines).map((med, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.medicineCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.medicineTouchable}>
                <LinearGradient
                  colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
                  style={styles.medicineGlassCard}
                >
                  <View style={styles.medicineHeader}>
                    <View style={styles.medicineIconContainer}>
                      <Ionicons
                        name="medical-outline"
                        size={24}
                        color="#667eea"
                      />
                    </View>
                    <View style={styles.medicineInfo}>
                      <Text style={styles.medicineName}>
                        {med.medicineName}
                      </Text>
                      <Text style={styles.medicineDosage}>{med.dosage}</Text>
                    </View>
                  </View>

                  <View style={styles.medicineDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={16} color="#8e9aaf" />
                      <Text style={styles.detailText}>{med.frequency}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#8e9aaf"
                      />
                      <Text style={styles.detailText}>{med.duration} days</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  overviewCard: {
    marginBottom: 30,
  },
  glassCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  overviewHeader: {
    marginBottom: 20,
  },
  diseaseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  diseaseText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2d3436",
    flex: 1,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 4,
  },
  hospitalName: {
    fontSize: 14,
    color: "#636e72",
  },
  viewPrescriptionButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 8,
  },
  medicinesSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 12,
    flex: 1,
  },
  medicineCount: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  medicineCard: {
    marginBottom: 16,
  },
  medicineTouchable: {
    borderRadius: 20,
    overflow: "hidden",
  },
  medicineGlassCard: {
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  medicineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  medicineIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 4,
  },
  medicineDosage: {
    fontSize: 14,
    color: "#636e72",
  },
  medicineArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  medicineDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 13,
    color: "#8e9aaf",
    marginLeft: 6,
  },

  modalOverlaySpinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  loadingCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#667eea",
    fontWeight: "600",
  },
});
