import database from "@react-native-firebase/database";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function ReminderScreen() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState({});

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
      title: "New Prescription Added",
      message: `Prescription added by Dr. ${doctor} at ${hospital} on ${prescription.date}`,
      type: "prescription",
      icon: "💊",
      statusColor: "#10B981",
      statusText: "New",
    });

    // Reminder: Follow-up (if required)
    const followUp = prescription.followUpDetails;
    if (followUp?.followUpRequired === "Yes" && followUp.followUpDate) {
      reminders.push({
        id: `reminder${idCounter++}`,
        title: "Follow-up Scheduled",
        message: `Follow-up scheduled by Dr. ${doctor} at ${hospital} on ${followUp.followUpDate}`,
        type: "followup",
        icon: "🔁",
        statusColor: "#F59E0B",
        statusText: "Scheduled",
      });
    }
  });

  const renderReminder = ({ item, index }) => {
    return (
      <Animated.View
        style={[
          styles.reminderCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
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
            <View style={styles.reminderContainer}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.statusColor + "20" },
                ]}
              >
                <Text style={styles.cardIcon}>{item.icon}</Text>
              </View>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: item.statusColor },
                    ]}
                  />
                  <Text
                    style={[styles.statusText, { color: item.statusColor }]}
                  >
                    {item.statusText}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Reminder Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.reminderMessage}>{item.message}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
      </View>
      <Text style={styles.emptyTitle}>No Reminders Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your reminders will appear here when you have new prescriptions or
        follow-ups scheduled.
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
              <Text style={styles.headerTitle}>Reminders</Text>
              <Text style={styles.headerSubtitle}>
                Stay on top of your health
              </Text>
            </View>
          </Animated.View>

          {/* Loading Modal */}
          <Modal transparent visible={loading} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Loading reminders...</Text>
              </View>
            </View>
          </Modal>

          {/* Reminders List */}
          <View style={styles.contentSection}>
            {reminders.length > 0 ? (
              reminders.map((item, index) => renderReminder({ item, index }))
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
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  reminderCard: {
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
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
  reminderContainer: {
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
  cardIcon: {
    fontSize: 24,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
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
  messageContainer: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },
  reminderMessage: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    fontWeight: "500",
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
  emptyIcon: {
    fontSize: 48,
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
