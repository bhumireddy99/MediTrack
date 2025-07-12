import { Ionicons } from "@expo/vector-icons";
import database from "@react-native-firebase/database";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function PrescriptionScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

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
          setLoading(false);
        } else {
          setItems([]);
          setLoading(false);
        }
      });

    return () => {
      database().ref("/patientRecords").off("value", onValueChange);
    };
  }, []);

  const prescriptions = Object.entries(items).map(([id, prescription]) => ({
    id,
    ...prescription,
    hospital: prescription.hospital,
    doctor: prescription.doctor,
    disease: prescription.patientInfo.diagnosis,
    date: prescription.patientInfo.date || "Recent",
  }));

  const filters = ["All", "Recent", "Ongoing", "Completed"];

  const getDiseaseIcon = (disease) => {
    const diseaseLower = disease?.toLowerCase() || "";
    if (diseaseLower.includes("fever") || diseaseLower.includes("cold")) {
      return "thermometer";
    } else if (diseaseLower.includes("pain") || diseaseLower.includes("ache")) {
      return "medical";
    } else if (diseaseLower.includes("infection")) {
      return "bug";
    } else if (diseaseLower.includes("diabetes")) {
      return "fitness";
    } else if (
      diseaseLower.includes("heart") ||
      diseaseLower.includes("cardiac")
    ) {
      return "heart";
    } else {
      return "medical-outline";
    }
  };

  const getStatusColor = (prescription) => {
    // Simple logic to determine status based on date or other factors
    const isRecent = prescription.date === "Recent";
    const isOngoing = prescription.medicines?.some(
      (med) =>
        new Date(med.startDate) <= new Date() &&
        new Date(med.startDate) + med.duration * 24 * 60 * 60 * 1000 >=
          new Date()
    );

    if (isRecent) return "#10B981"; // Green for recent
    if (isOngoing) return "#F59E0B"; // Amber for ongoing
    return "#6B7280"; // Gray for completed
  };

  const getStatusText = (prescription) => {
    const isRecent = prescription.date === "Recent";
    const isOngoing = prescription.medicines?.some(
      (med) =>
        new Date(med.startDate) <= new Date() &&
        new Date(med.startDate) + med.duration * 24 * 60 * 60 * 1000 >=
          new Date()
    );

    if (isRecent) return "Recent";
    if (isOngoing) return "Ongoing";
    return "Completed";
  };

  const renderPrescription = ({ item, index }) => {
    const statusColor = getStatusColor(item);
    const statusText = getStatusText(item);
    const diseaseIcon = getDiseaseIcon(item.disease);

    return (
      <Animated.View
        style={[
          styles.prescriptionCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() =>
            navigation.navigate("PrescriptionDetails", { prescription: item })
          }
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.95)",
              "rgba(255,255,255,0.85)",
              "rgba(248,250,252,0.9)",
            ]}
            style={styles.cardGradient}
          >
            {/* Header with status */}
            <View style={styles.cardHeader}>
              <View style={styles.diseaseContainer}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: statusColor + "20" },
                  ]}
                >
                  <Ionicons name={diseaseIcon} size={24} color={statusColor} />
                </View>
                <View style={styles.diseaseInfo}>
                  <Text style={styles.diseaseTitle}>{item.disease}</Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: statusColor },
                      ]}
                    />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {statusText}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() =>
                  navigation.navigate("PrescriptionDetails", {
                    prescription: item,
                  })
                }
              >
                <Ionicons name="chevron-forward" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>

            {/* Doctor and Hospital Info */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="medical" size={16} color="#667eea" />
                  <Text style={styles.infoLabel}>Doctor</Text>
                  <Text style={styles.infoValue}>Dr. {item.doctor}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="business" size={16} color="#667eea" />
                  <Text style={styles.infoLabel}>Hospital</Text>
                  <Text style={styles.infoValue}>{item.hospital}</Text>
                </View>
              </View>
            </View>

            {/* Medicine Count */}
            <View style={styles.medicineCountContainer}>
              <Text style={styles.medicineCountText}>
                💊 {item.medicines?.length || 0} medicines prescribed
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
      </View>
      <Text style={styles.emptyTitle}>No Prescriptions Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your prescriptions will appear here once they're added to your profile.
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.gradientContainer}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Prescriptions</Text>
              <Text style={styles.headerSubtitle}>
                Manage your medical prescriptions
              </Text>
            </View>
          </Animated.View>

          {/* Loading Modal */}
          <Modal transparent visible={loading} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Loading prescriptions...</Text>
              </View>
            </View>
          </Modal>

          {/* Prescriptions List */}
          <View style={styles.contentSection}>
            {prescriptions.length > 0 ? (
              <FlatList
                data={prescriptions}
                keyExtractor={(item) => item.id}
                renderItem={renderPrescription}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                scrollEnabled={false}
              />
            ) : (
              <EmptyState />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTop: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e2e8f0",
    fontWeight: "500",
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterList: {
    paddingRight: 24,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  filterButtonActive: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  filterButtonTextActive: {
    color: "#667eea",
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listContainer: {
    paddingBottom: 20,
  },
  prescriptionCard: {
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  cardTouchable: {
    borderRadius: 20,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 20,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  diseaseContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "600",
  },
  medicineCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
    // paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  medicineCountText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#e2e8f0",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});
