import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { clearUserFromStorage } from "../authStore";
import { logout } from "../redux/auth";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [takenModal, setTakenModal] = useState(false);
  const [upcomingModal, setUpcomingModal] = useState(false);
  const [missedModal, setMissedModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const date = useRef(new Date());

  const [medicines, setMedicines] = useState([
    { id: 1, time: "8:00 AM", name: "Thyronorm", status: "Taken" },
    { id: 2, time: "4:00 PM", name: "Paracetamol", status: "Upcoming" },
    { id: 3, time: "10:00 PM", name: "Vitamin D", status: "Upcoming" },
  ]);

  const [missedMedicines, setMissedMedicines] = useState([
    { id: 1, time: "8:00 AM", name: "Dolo 650", status: "Missed" },
  ]);

  const handleMarkAsTaken = (id) => {
    const updated = medicines.map((med) =>
      med.id === id ? { ...med, status: "Taken" } : med
    );
    setMedicines(updated);
  };

  const handleLogout = async () => {
    await clearUserFromStorage();
    dispatch(logout());
  };

  const takenCount = medicines.filter((m) => m.status === "Taken").length;
  const upcomingCount = medicines.filter((m) => m.status === "Upcoming").length;
  const missedCount = missedMedicines.length;

  const upcomingMeds = medicines.filter((med) => med.status === "Upcoming");
  const takenMeds = medicines.filter((med) => med.status === "Taken");

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    date.current = selectedDate;
  };

  const formatDateLabel = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    if (target.getTime() === today.getTime()) return "Today's Medicine";
    if (target.getTime() === yesterday.getTime()) return "Yesterday's Medicine";
    if (target.getTime() === tomorrow.getTime()) return "Tomorrow's Medicine";

    return `Medicine's for ${target.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hello, Bhumika 👋</Text>
            <Text style={styles.subGreeting}>Here’s your health overview.</Text>
          </View>
          <TouchableOpacity
            style={styles.userIconContainer}
            onPress={() => setUserModal(true)}
          >
            <Ionicons name="person-circle-outline" size={36} color="#734BD1" />
          </TouchableOpacity>
        </View>

        <Modal transparent visible={loading} animationType="fade">
          <View style={styles.modalOverlaySpinner}>
            <ActivityIndicator size="large" color="#734BD1" />
          </View>
        </Modal>

        <View style={styles.card}>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={styles.labelBold}>Date:</Text>
            <Text style={styles.sub}>{date.current.toDateString()}</Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            mode="date"
            value={date.current}
            display="calendar"
            onChange={onChange}
          />
        )}

        <View style={styles.highlightsRow}>
          <TouchableOpacity
            onPress={() => setTakenModal(true)}
            style={styles.highlightCard}
          >
            <Text style={styles.highlightValue}>{takenCount}</Text>
            <Text style={styles.highlightLabel}>Taken</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUpcomingModal(true)}
            style={styles.highlightCard}
          >
            <Text style={styles.highlightValue}>{upcomingCount}</Text>
            <Text style={styles.highlightLabel}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMissedModal(true)}
            style={styles.highlightCard}
          >
            <Text style={styles.highlightValue}>{missedCount}</Text>
            <Text style={styles.highlightLabel}>Missed</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>
          {formatDateLabel(date.current)}
        </Text>
        <View style={styles.card}>
          {medicines.map((item) => (
            <View key={item.id} style={styles.medRow}>
              <View style={styles.timeBlock}>
                <Text style={styles.time}>⏰ {item.time}</Text>
                <Text style={styles.med}>💊 {item.name}</Text>
              </View>

              {item.status === "Taken" ? (
                <Text style={styles.statusTaken}>✓ Taken</Text>
              ) : (
                <TouchableOpacity
                  style={styles.takeBtn}
                  onPress={() => handleMarkAsTaken(item.id)}
                >
                  <Text style={styles.takeBtnText}>Mark as Taken</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Prescription")}
          style={styles.card}
        >
          <Text style={styles.iconRow}>🩺 You have 2 active prescriptions</Text>
          <Text style={styles.sub}>Tap to view in My Prescription</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.alertCard}>
          <Text style={styles.iconRow}>❗ You have 1 missed dose</Text>
          {missedMedicines.map((item) => (
            <View key={item.id} style={styles.medRow}>
              <View style={styles.timeBlock}>
                <Text style={styles.time}>⏰ {item.time}</Text>
                <Text style={styles.med}>💊 {item.name}</Text>
              </View>
              <Text style={styles.statusMissed}>x Missed</Text>
            </View>
          ))}
        </TouchableOpacity>

        <Modal
          transparent
          visible={userModal}
          animationType="slide"
          onRequestClose={() => setUserModal(false)}
        >
          <View style={styles.modalOverlay2}>
            <View style={[styles.card, { width: "80%" }]}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.modalHeader}>👤 User Info</Text>
                <Text
                  onPress={() => setUserModal(false)}
                  style={{ fontSize: 20, fontWeight: "600", color: "#734BD1" }}
                >
                  X
                </Text>
              </View>
              <Text style={{ marginBottom: 20 }}>{user?.email}</Text>
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutBtnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={takenModal}
          onRequestClose={() => setTakenModal(false)}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              style={styles.modalCardWrapper}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Medicines Taken</Text>

                <ScrollView
                  style={styles.modalScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {takenMeds.map((item) => (
                    <View key={item.id} style={styles.medRow}>
                      <View style={styles.timeBlock}>
                        <Text style={styles.time}>⏰ {item.time}</Text>
                        <Text style={styles.med}>💊 {item.name}</Text>
                      </View>
                      <Text style={styles.statusTaken}>✓ Taken</Text>
                    </View>
                  ))}
                </ScrollView>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setTakenModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={upcomingModal}
          onRequestClose={() => setUpcomingModal(false)}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              style={styles.modalCardWrapper}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Upcoming Medicines</Text>

                <ScrollView
                  style={styles.modalScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {upcomingMeds.map((item) => (
                    <View key={item.id} style={styles.medRow}>
                      <View style={styles.timeBlock}>
                        <Text style={styles.time}>⏰ {item.time}</Text>
                        <Text style={styles.med}>💊 {item.name}</Text>
                      </View>
                      {/* <Text style={styles.statusTaken}>✓ Taken</Text> */}
                    </View>
                  ))}
                </ScrollView>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setUpcomingModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={missedModal}
          onRequestClose={() => setMissedModal(false)}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              style={styles.modalCardWrapper}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Medicines Taken</Text>

                <ScrollView
                  style={styles.modalScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {missedMedicines.map((item) => (
                    <View key={item.id} style={styles.medRow}>
                      <View style={styles.timeBlock}>
                        <Text style={styles.time}>⏰ {item.time}</Text>
                        <Text style={styles.med}>💊 {item.name}</Text>
                      </View>
                      <Text style={styles.statusMissed}>x Missed</Text>
                    </View>
                  ))}
                </ScrollView>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setMissedModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const colors = {
  background: "#F5F7FA",
  card: "#FFFFFF",
  primary: "#6C5CE7",
  accent: "#A29BFE",
  text: "#2D3436",
  muted: "#636e72",
  overlay: "rgba(0,0,0,0.4)",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFF",
  },
  scroll: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userIconContainer: {
    padding: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 4,
    marginTop: 20,
  },
  subGreeting: {
    fontSize: 15,
    color: "#777",
    marginBottom: 20,
  },
  highlightsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  highlightCard: {
    backgroundColor: "#EFEAFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    elevation: 1,
  },
  highlightValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7B47F5",
  },
  highlightLabel: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E3F3",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
  },
  alertCard: {
    backgroundColor: "#FFF0F0",
    borderColor: "#EA5455",
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 10,
  },
  labelBold: {
    fontSize: 14,
    color: "#1E1E1E",
    fontWeight: "600",
  },
  sub: {
    fontSize: 13,
    color: "#777",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1E1E1E",
    marginTop: 10,
  },
  timeBlock: {
    flex: 1,
    paddingRight: 10,
  },
  time: {
    fontWeight: "600",
    fontSize: 15,
    color: "#1E1E1E",
    marginBottom: 2,
  },
  med: {
    fontSize: 13,
    color: "#555",
  },
  medRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEAFF",
  },
  statusTaken: {
    color: "#28C76F",
    fontWeight: "700",
    fontSize: 13,
  },
  statusMissed: {
    color: "red",
    fontWeight: "700",
    fontSize: 13,
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
  iconRow: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
    color: "#1E1E1E",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay2: {
    flex: 1,
    position: "absolute",
    right: -45,
    top: 80,
    width: "80%",
  },
  modalCardWrapper: {
    width: width * 0.9,
    borderRadius: 24,
    padding: 2,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    maxHeight: height * 0.75,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#6C5CE7",
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
    color: "#636e72",
  },
  modalValue: {
    fontSize: 15,
    color: "#2D3436",
  },
  closeButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: "#EA5455",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  modalOverlaySpinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
