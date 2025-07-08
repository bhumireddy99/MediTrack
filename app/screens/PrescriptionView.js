import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RNFetchBlob from "react-native-blob-util";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

export default function PrescriptionViewScreen({ route }) {
  const { prescription } = route.params;
  const [loading, setLoading] = useState(false);

  console.log(prescription);

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
      Alert.alert("Download Successful");
    } catch (error) {
      // console.log(error);
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  return (
    <View style={styles.container}>
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.modalOverlaySpinner}>
          <ActivityIndicator size="large" color="#734BD1" />
        </View>
      </Modal>

      <View style={{ paddingBottom: 20, flex: 1 }}>
        <WebView source={{ html: htmlContent }} sharedCookiesEnabled />
      </View>
      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 10,
          paddingVertical: 5,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            padding: 10,
            textAlign: "center",
            fontSize: 16,
          }}
          onPress={() => {
            prescriptionDowload();
          }}
        >
          Download Prescription
        </Text>
      </View>
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
