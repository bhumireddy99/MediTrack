import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import database from "@react-native-firebase/database";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
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
  const [items, setItems] = useState({});
  const [medicineList, setMedicineList] = useState([]);
  const [followUpDetails, setFollowUpDetails] = useState([]);
  const [missedMedicines, setMissedMedicines] = useState([]);

  useEffect(() => {
    setLoading(true);
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

  const date = useRef(new Date());

  const markAsTaken = async (medKey, medIndex, dayIndex, timeIndex, id) => {
    const path = `/patientRecords/Susan/${id}/medicines/${medIndex}/taken/${dayIndex}/${timeIndex}`;
    await database().ref(path).set(1);
  };

  const handleLogout = async () => {
    await clearUserFromStorage();
    dispatch(logout());
  };

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

  const timeLabels = ["Morning", "Afternoon", "Night"];
  const timeHours = [9, 13, 21];

  useEffect(() => {
    if (!items) return;
    const list = [];
    const now = new Date();
    let followUpsArray = [];
    Object.keys(items).forEach((key) => {
      const {
        medicines = [],
        patientInfo,
        followUpDetails,
        hospital,
        doctor,
        id,
      } = items[key];

      const followUp = followUpDetails;
      if (followUp?.followUpRequired === "Yes" && followUp.followUpDate) {
        followUpsArray.push({
          date: followUp.followUpDate,
          doctor: doctor,
          hospital: hospital,
        });
      }
      setFollowUpDetails(followUpsArray);

      medicines.forEach((med, medIndex) => {
        const selectedDate = new Date(date.current); // Ensure it's a Date object
        selectedDate.setHours(0, 0, 0, 0); // Reset time

        const startDate = new Date(med.startDate); // Parse "7/9/2025" properly

        const [month, day, year] = med.startDate.split("/").map(Number);
        const start = new Date(year, month - 1, day); // Explicit parsing
        start.setHours(0, 0, 0, 0);

        const dayIndex = Math.floor(
          (selectedDate - start) / (1000 * 60 * 60 * 24)
        );

        if (dayIndex >= 0 && dayIndex < parseInt(med.duration)) {
          med.timeOfConsumption.forEach((time, i) => {
            const timeIdx = timeLabels.indexOf(time);
            const medTime = new Date(selectedDate);
            medTime.setHours(timeHours[timeIdx], 0, 0, 0);

            const taken = med.taken?.[dayIndex]?.[i] || 0;
            let status = "Upcoming";
            if (taken === 1) status = "Taken";
            else if (medTime < new Date()) status = "Missed";
            list.push({
              medIndex,
              medKey: key,
              dayIndex,
              timeIndex: i,
              time,
              name: med.medicineName,
              status,
              consumption: med.consumption,
              dosage: med.dosage,
              instructions: med.instructions,
              id: id,
            });
          });
        }
      });
    });

    setMedicineList(list);
    setMissedMedicines(list.filter((item) => item.status === "Missed"));
  }, [date.current, items]);

  const patientName = Object.values(items)?.[0]?.patientInfo?.name;

  const grouped = {
    Taken: [],
    Missed: [],
    Upcoming: [],
  };

  medicineList.forEach((m) => grouped[m.status].push(m));

  const messageDisplay = (type) => {
    if (type === "Taken") {
      return " ⁠Umm... your meds are still waiting. Don’t keep them hanging!";
    } else if (type === "Missed") {
      return "⁠You nailed it — not a single pill missed! Your health is proud of you!";
    } else if (type === "Upcoming") {
      return "⁠You’re free… at least from pills! Enjoy the break!";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.headerRow}>
          <View>
            <Text allowFontScaling={false} style={styles.greeting}>
              Hello, {patientName} 👋
            </Text>
            <Text allowFontScaling={false} style={styles.subGreeting}>
              Here’s your health overview.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.userIconContainer}
            onPress={() => setUserModal(!userModal)}
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
            {/* <Text allowFontScaling={false} style={styles.labelBold}>Date:</Text> */}
            <Text allowFontScaling={false} style={styles.labelBold}>
              {date.current.toDateString()}
            </Text>
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
          {["Taken", "Upcoming", "Missed"].map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.highlightCard}
              onPress={() => {
                if (type === "Taken") setTakenModal(true);
                if (type === "Missed") setMissedModal(true);
                if (type === "Upcoming") setUpcomingModal(true);
              }}
            >
              <Text allowFontScaling={false} style={styles.highlightValue}>
                {grouped[type].length}
              </Text>
              <Text allowFontScaling={false} style={styles.highlightLabel}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text allowFontScaling={false} style={styles.sectionHeader}>
          {formatDateLabel(date.current)}
        </Text>
        <View style={styles.card}>
          {medicineList.length === 0 ? (
            <View>
              <Text> 💊 You have no medicins scheduled</Text>
            </View>
          ) : (
            <View>
              {medicineList.map((med, i) => (
                <View key={i} style={styles.medRow}>
                  {/* <Text>
                    💊 {med.name} - {med.time} ({med.status})
                  </Text> */}
                  <View style={styles.timeBlock}>
                    <Text allowFontScaling={false} style={styles.time}>
                      ⏰ {med.name}
                    </Text>
                    <Text allowFontScaling={false} style={styles.med}>
                      💊 {med.time} - {med.consumption} ({med.status})
                    </Text>
                  </View>

                  {med.status !== "Taken" && (
                    <TouchableOpacity
                      style={styles.takeBtn}
                      onPress={() =>
                        markAsTaken(
                          med.medKey,
                          med.medIndex,
                          med.dayIndex,
                          med.timeIndex,
                          med.id
                        )
                      }
                    >
                      <Text allowFontScaling={false} style={styles.takeBtnText}>
                        Mark as Taken
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {followUpDetails.length > 0 &&
          followUpDetails.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text allowFontScaling={false} style={styles.iconRow}>
                🩺 Your next follow-up is on {item.date} at {item.hospital} with
                Dr. {item.doctor}
              </Text>
            </View>
          ))}

        <TouchableOpacity style={styles.alertCard}>
          <Text allowFontScaling={false} style={styles.iconRow}>
            ❗ You have {missedMedicines.length} missed dose
          </Text>
          {missedMedicines.map((item) => (
            <View key={item.id} style={styles.medRow}>
              <View style={styles.timeBlock}>
                <Text allowFontScaling={false} style={styles.time}>
                  ⏰ {item.time} - {item.consumption}
                </Text>
                <Text allowFontScaling={false} style={styles.med}>
                  💊 {item.name}
                </Text>
              </View>
              <Text allowFontScaling={false} style={styles.statusMissed}>
                x Missed
              </Text>
            </View>
          ))}
        </TouchableOpacity>

        {userModal && (
          <View style={styles.userDropdown}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text allowFontScaling={false} style={styles.logoutBtnText}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {["Taken", "Upcoming", "Missed"].map((type) => (
          <Modal
            key={type}
            transparent
            visible={
              (type === "Taken" && takenModal) ||
              (type === "Missed" && missedModal) ||
              (type === "Upcoming" && upcomingModal)
            }
            onRequestClose={() => {
              if (type === "Taken") setTakenModal(false);
              if (type === "Missed") setMissedModal(false);
              if (type === "Upcoming") setUpcomingModal(false);
            }}
          >
            <View style={styles.modalOverlay}>
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                style={styles.modalCardWrapper}
              >
                <View style={styles.modalContent}>
                  <Text allowFontScaling={false} style={styles.modalHeader}>
                    {type} Medicines
                  </Text>
                  <ScrollView
                    style={styles.modalScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    <View>
                      {grouped[type].length === 0 ? (
                        <View>
                          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                            {messageDisplay(type)}
                          </Text>
                        </View>
                      ) : (
                        <View>
                          {grouped[type].map((m, i) => (
                            <View key={m.id} style={styles.medRow}>
                              <View style={styles.timeBlock}>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.time}
                                >
                                  ⏰ {m.time} - {m.consumption}
                                </Text>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.med}
                                >
                                  💊 {m.name}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </ScrollView>
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => {
                      if (type === "Taken") setTakenModal(false);
                      if (type === "Missed") setMissedModal(false);
                      if (type === "Upcoming") setUpcomingModal(false);
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={styles.closeButtonText}
                    >
                      Close
                    </Text>
                  </Pressable>
                </View>
              </LinearGradient>
            </View>
          </Modal>
        ))}
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
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  userDropdown: {
    position: "absolute",
    top: 100,
    right: 20,
    width: 180,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
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
