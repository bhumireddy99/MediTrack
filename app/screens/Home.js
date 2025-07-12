import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import database from "@react-native-firebase/database";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    ]).start();

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
        const selectedDate = new Date(date.current);
        selectedDate.setHours(0, 0, 0, 0);

        const [month, day, year] = med.startDate.split("/").map(Number);
        const start = new Date(year, month - 1, day);
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
      return " ⁠Umm... your meds are still waiting. Don't keep them hanging!";
    } else if (type === "Missed") {
      return "⁠You nailed it — not a single pill missed! Your health is proud of you!";
    } else if (type === "Upcoming") {
      return "⁠You're free… at least from pills! Enjoy the break!";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Taken":
        return "checkmark-circle";
      case "Missed":
        return "close-circle";
      case "Upcoming":
        return "time";
      default:
        return "help-circle";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Taken":
        return "#10B981";
      case "Missed":
        return "#EF4444";
      case "Upcoming":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <Animated.View
            style={[
              styles.headerRow,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.headerContent}>
              <Text allowFontScaling={false} style={styles.greeting}>
                Hello, {patientName} 👋
              </Text>
              <Text allowFontScaling={false} style={styles.subGreeting}>
                Here's your health overview for today
              </Text>
            </View>
            <TouchableOpacity
              style={styles.userIconContainer}
              onPress={() => setUserModal(!userModal)}
            >
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={styles.userIconGradient}
              >
                <Ionicons name="person" size={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Modal transparent visible={loading} animationType="fade">
            <View style={styles.modalOverlaySpinner}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.loadingCard}
              >
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>
                  Loading your health data...
                </Text>
              </LinearGradient>
            </View>
          </Modal>

          <Animated.View
            style={[
              styles.dateCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
                style={styles.dateGradient}
              >
                <Ionicons name="calendar" size={20} color="#667eea" />
                <Text allowFontScaling={false} style={styles.dateText}>
                  {date.current.toDateString()}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#667eea" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {showPicker && (
            <DateTimePicker
              mode="date"
              value={date.current}
              display="calendar"
              onChange={onChange}
            />
          )}

          <Animated.View
            style={[
              styles.highlightsRow,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {[
              {
                type: "Taken",
                icon: "checkmark-circle",
                iconColor: "#10B981",
              },
              {
                type: "Upcoming",
                icon: "time",
                iconColor: "#F59E0B",
              },
              {
                type: "Missed",
                icon: "close-circle",
                iconColor: "#EF4444",
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={item.type}
                style={styles.highlightCard}
                onPress={() => {
                  if (item.type === "Taken") setTakenModal(true);
                  if (item.type === "Missed") setMissedModal(true);
                  if (item.type === "Upcoming") setUpcomingModal(true);
                }}
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
                  style={styles.highlightGradient}
                >
                  <Ionicons name={item.icon} size={24} color={item.iconColor} />
                  <Text allowFontScaling={false} style={styles.highlightValue}>
                    {grouped[item.type].length}
                  </Text>
                  <Text allowFontScaling={false} style={styles.highlightLabel}>
                    {item.type}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </Animated.View>

          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text allowFontScaling={false} style={styles.sectionHeader}>
              {formatDateLabel(date.current)}
            </Text>

            <LinearGradient
              colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
              style={styles.medicineCard}
            >
              {medicineList.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="medical" size={48} color="#CBD5E1" />
                  <Text allowFontScaling={false} style={styles.emptyText}>
                    No medicines scheduled for today
                  </Text>
                  <Text allowFontScaling={false} style={styles.emptySubtext}>
                    Enjoy your healthy day! 🎉
                  </Text>
                </View>
              ) : (
                <View>
                  {medicineList.map((med, i) => (
                    <View key={i} style={styles.medRow}>
                      <View style={styles.medInfo}>
                        <View style={styles.medHeader}>
                          <Ionicons
                            name={getStatusIcon(med.status)}
                            size={20}
                            color={getStatusColor(med.status)}
                          />
                          <Text allowFontScaling={false} style={styles.medName}>
                            {med.name}
                          </Text>
                        </View>
                        <Text
                          allowFontScaling={false}
                          style={styles.medDetails}
                        >
                          ⏰ {med.time} • {med.consumption} • {med.dosage}
                        </Text>
                        {med.instructions && (
                          <Text
                            allowFontScaling={false}
                            style={styles.medInstructions}
                          >
                            📝 {med.instructions}
                          </Text>
                        )}
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
                          <LinearGradient
                            colors={["#667eea", "#764ba2"]}
                            style={styles.takeBtnGradient}
                          >
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#FFFFFF"
                            />
                            <Text
                              allowFontScaling={false}
                              style={styles.takeBtnText}
                            >
                              Taken
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </LinearGradient>
          </Animated.View>

          {followUpDetails.length > 0 && (
            <Animated.View
              style={[
                styles.followUpContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {followUpDetails.map((item, index) => (
                <LinearGradient
                  key={index}
                  colors={["#A78BFA", "#8B5CF6"]}
                  style={styles.followUpCard}
                >
                  <View style={styles.followUpContent}>
                    <Ionicons name="medical" size={24} color="#FFFFFF" />
                    <View style={styles.followUpText}>
                      <Text
                        allowFontScaling={false}
                        style={styles.followUpTitle}
                      >
                        Next Follow-up
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={styles.followUpDetails}
                      >
                        {item.date} at {item.hospital}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={styles.followUpDoctor}
                      >
                        Dr. {item.doctor}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              ))}
            </Animated.View>
          )}

          {missedMedicines.length > 0 && (
            <Animated.View
              style={[
                styles.missedContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={["#FEF2F2", "#FEE2E2"]}
                style={styles.missedCard}
              >
                <View style={styles.missedHeader}>
                  <Ionicons name="warning" size={24} color="#EF4444" />
                  <Text allowFontScaling={false} style={styles.missedTitle}>
                    Missed Doses ({missedMedicines.length})
                  </Text>
                </View>
                {missedMedicines.map((item) => (
                  <View key={item.id} style={styles.missedItem}>
                    <View style={styles.missedInfo}>
                      <Text allowFontScaling={false} style={styles.missedTime}>
                        ⏰ {item.time} - {item.consumption}
                      </Text>
                      <Text allowFontScaling={false} style={styles.missedName}>
                        💊 {item.name}
                      </Text>
                    </View>
                    <View style={styles.missedBadge}>
                      <Text
                        allowFontScaling={false}
                        style={styles.missedBadgeText}
                      >
                        Missed
                      </Text>
                    </View>
                  </View>
                ))}
              </LinearGradient>
            </Animated.View>
          )}

          {userModal && (
            <View style={styles.userDropdown}>
              <LinearGradient
                colors={["#FFFFFF", "#F8FAFC"]}
                style={styles.dropdownGradient}
              >
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={handleLogout}
                >
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    style={styles.logoutGradient}
                  >
                    <Ionicons
                      name="log-out-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text allowFontScaling={false} style={styles.logoutBtnText}>
                      Logout
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
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
                  colors={["#667eea", "#764ba2"]}
                  style={styles.modalCardWrapper}
                >
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeaderContainer}>
                      <Ionicons
                        name={getStatusIcon(type)}
                        size={28}
                        color={getStatusColor(type)}
                      />
                      <Text allowFontScaling={false} style={styles.modalHeader}>
                        {type} Medicines
                      </Text>
                    </View>
                    <ScrollView
                      style={styles.modalScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      <View>
                        {grouped[type].length === 0 ? (
                          <View style={styles.modalEmptyState}>
                            <Ionicons name="happy" size={48} color="#CBD5E1" />
                            <Text style={styles.modalEmptyText}>
                              {messageDisplay(type)}
                            </Text>
                          </View>
                        ) : (
                          <View>
                            {grouped[type].map((m, i) => (
                              <View key={m.id} style={styles.modalMedRow}>
                                <View style={styles.modalMedInfo}>
                                  <Text
                                    allowFontScaling={false}
                                    style={styles.modalMedTime}
                                  >
                                    ⏰ {m.time} - {m.consumption}
                                  </Text>
                                  <Text
                                    allowFontScaling={false}
                                    style={styles.modalMedName}
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
                      <LinearGradient
                        colors={["#667eea", "#764ba2"]}
                        style={styles.closeButtonGradient}
                      >
                        <Text
                          allowFontScaling={false}
                          style={styles.closeButtonText}
                        >
                          Close
                        </Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                </LinearGradient>
              </View>
            </Modal>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scroll: {
    padding: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerContent: {
    flex: 1,
  },
  userIconContainer: {
    marginLeft: 16,
  },
  userIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  dateCard: {
    marginBottom: 32,
  },
  dateButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  dateGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginHorizontal: 12,
  },
  highlightsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  highlightCard: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  highlightGradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 8,
    marginBottom: 4,
  },
  highlightLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  medicineCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
    textAlign: "center",
  },
  medRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 8,
  },
  medInfo: {
    flex: 1,
    paddingRight: 16,
  },
  medHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  medName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 8,
  },
  medDetails: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  medInstructions: {
    fontSize: 12,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  takeBtn: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  takeBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  takeBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  followUpContainer: {
    marginBottom: 30,
  },
  followUpCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    marginVertical: 5,
  },
  followUpContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  followUpText: {
    marginLeft: 16,
    flex: 1,
  },
  followUpTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  followUpDetails: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 2,
  },
  followUpDoctor: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  missedContainer: {
    // marginBottom: 32,
  },
  missedCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  missedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  missedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#B91C1C",
    marginLeft: 12,
  },
  missedItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FEF2F2",
    marginBottom: 8,
  },
  missedInfo: {
    flex: 1,
  },
  missedTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B91C1C",
    marginBottom: 4,
  },
  missedName: {
    fontSize: 14,
    color: "#7F1D1D",
  },
  missedBadge: {
    backgroundColor: "#B91C1C",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  missedBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  userDropdown: {
    position: "absolute",
    top: 100,
    right: 20,
    width: 200,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 10,
  },
  dropdownGradient: {
    padding: 16,
  },
  logoutBtn: {
    borderRadius: 12,
    overflow: "hidden",
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logoutBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCardWrapper: {
    width: width * 0.9,
    borderRadius: 24,
    padding: 2,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    maxHeight: height * 0.75,
  },
  modalHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 12,
  },
  modalScroll: {
    marginBottom: 20,
  },
  modalEmptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  modalEmptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  modalMedRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 8,
  },
  modalMedInfo: {
    flex: 1,
  },
  modalMedTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  modalMedName: {
    fontSize: 14,
    color: "#64748B",
  },
  closeButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  closeButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  modalOverlaySpinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
});

export default HomeScreen;
