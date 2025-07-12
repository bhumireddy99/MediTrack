import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import RNFetchBlob from "react-native-blob-util";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const { width, height } = Dimensions.get("window");

export default function PrescriptionViewScreen({ route }) {
  const { prescription } = route.params;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Animation values for header
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    ]).start();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const medicineRows = prescription.medicines
    .map((med, index) => {
      const isArrayOfArrays = Array.isArray(med.taken[0]);
      const frequency = isArrayOfArrays
        ? `${med.taken[0].length} times a day`
        : `${med.timeOfConsumption.length} times a day`;
      const timing = med.timeOfConsumption
        .map((time) => `${time} ${med.consumption}`)
        .join(", ");

      return `
      <tr>
        <td>${index + 1}</td>
        <td>${med.medicineName} ${med.dosage}</td>
        <td>${frequency}</td>
        <td>${timing}</td>
        <td>${med.duration} Days</td>
      </tr>`;
    })
    .join("");

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; padding: 10px; }
        h1, p { text-align: center; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .signature {
          margin-top: 60px;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <h1>Dr. ${prescription.doctor}</h1>
      <p>General Physician</p>
      <p>${prescription.hospital}</p>
      <p>Phone: +91 98765 43210</p>
      <hr />
      <p><strong>Patient Name:</strong> ${prescription.patientInfo.name}</p>
      <p><strong>Age:</strong> ${prescription.patientInfo.age}</p>
      <p><strong>Date:</strong> ${prescription.date}</p>

      <table>
        <tr>
          <th>#</th>
          <th>Medicine</th>
          <th>Dosage</th>
          <th>Timing</th>
          <th>Duration</th>
        </tr>
        ${medicineRows}
      </table>

      <p><strong>Advice:</strong> ${
        prescription.followUpDetails.followUpRequired === "Yes"
          ? `Follow-up required on ${prescription.followUpDetails.followUpDate}`
          : "No follow-up required"
      }</p>
    </body>
  </html>
`;

  const prescriptionDowload = async () => {
    const htmlContent = `
    <h1 style="text-align: center;">Dr. ${prescription.doctor}</h1>
    <p style="text-align: center;">General Physician</p>
    <p style="text-align: center;">${prescription.hospital}</p>
    <p style="text-align: center;">Phone: +91 98765 43210</p>
    <hr />
    <p><strong>Patient Name:</strong> ${prescription.patientInfo.name}</p>
    <p><strong>Age/Gender:</strong>  ${prescription.patientInfo.age}</p>
    <p><strong>Date:</strong>${prescription.date}</p>

    <table border="1" style="width:100%; border-collapse:collapse;">
      <tr>
        <th>#</th>
        <th>Medicine</th>
        <th>Dosage</th>
        <th>Timing</th>
        <th>Duration</th>
      </tr>
      ${medicineRows}
    </table>

    <p><strong>Advice:</strong> Drink plenty of fluids, take rest, and avoid cold food.</p>
  `;

    try {
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: "PrescriptionForm",
        directory: "Documents",
      });
      // Define the destination path in the Downloads folder
      const destPath = `${RNFetchBlob.fs.dirs.DownloadDir}/PrescriptionForm.pdf`;

      // Move the generated PDF to the Downloads folder
      await RNFetchBlob.fs.mv(pdf.filePath, destPath);

      // Add the completed download with a notification
      await RNFetchBlob.android.addCompleteDownload({
        title: "Prescription Form",
        description: "Prescription Form has been downloaded successfully.",
        mime: "application/pdf",
        path: destPath,
        showNotification: true,
        useDownloadManager: false,
      });
      Alert.alert(
        "Download Successful",
        `Prescription has been saved to Downloads`
      );
    } catch (error) {
      // console.log(error);
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {/* Animated Header Section */}
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
                <Text style={styles.headerSubtitle}>View & Download</Text>
              </View>
              <View style={styles.headerIcon}>
                <Ionicons name="document-text" size={28} color="#fff" />
              </View>
            </Animated.View>
            {/* Scrollable Content */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-start",
              }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.container}>
                <Modal transparent visible={loading} animationType="fade">
                  <View style={styles.modalOverlaySpinner}>
                    <ActivityIndicator size="large" color="#734BD1" />
                  </View>
                </Modal>
                <View style={styles.webviewCard}>
                  <WebView
                    source={{ html: htmlContent }}
                    sharedCookiesEnabled
                    style={{ flex: 1, borderRadius: 24 }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  activeOpacity={0.85}
                  onPress={() => {
                    setLoading(true);
                    prescriptionDowload().finally(() => setLoading(false));
                  }}
                >
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="download" size={22} color="#fff" />
                    <Text style={styles.buttonText}>Download Prescription</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
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
  backgroundGradient: {
    flex: 1,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    // alignItems: "center", // REMOVE to allow full width
  },
  webviewCard: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
    overflow: "hidden",
  },
  downloadButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    marginTop: 16,
    shadowColor: "#f7971e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#fffbe6",
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
    marginLeft: 8,
  },
  modalOverlaySpinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
