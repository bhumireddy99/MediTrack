import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const prescriptions = [
  {
    id: '1',
    hospital: 'CityCare Hospital',
    doctor: 'Dr. Smith',
    disease: 'Fever',
    medicine: {
      name: 'Paracetamol',
      mg: '500mg',
      frequency: '3 times a day',
      duration: '7 days',
      schedule: '08:00 AM, 2:00 PM, 8:00 PM',
      how: 'After food with water',
      usage: 'Reduce fever and relieve mild pain',
      sideEffects: 'Nausea, rash, liver issues if overused',
      precautions: 'Avoid alcohol, follow dosage strictly',
    },
  },
  {
    id: '2',
    hospital: 'Green Valley Clinic',
    doctor: 'Dr. Alice',
    disease: 'Vitamin Deficiency',
    medicine: {
      name: 'Vitamin D',
      mg: '1000 IU',
      frequency: 'Once a day',
      duration: '30 days',
      schedule: '10:00 AM',
      how: 'With food or milk',
      usage: 'Improves calcium absorption & bone strength',
      sideEffects: 'Rare - nausea, weakness, confusion',
      precautions: 'Inform doctor if taking other supplements',
    },
  },
];

export default function PrescriptionScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const openModal = (item) => {
    setSelectedPrescription(item);
    setModalVisible(true);
  };

  const renderPrescription = ({ item }) => (
    <TouchableOpacity
      style={styles.prescriptionCard}
      onPress={() => openModal(item)}
    >
      <Text style={styles.cardTitle}>{item.disease}</Text>
      <View style={styles.cardInfoRow}>
        <Text style={styles.cardLabel}>🏥 {item.hospital}</Text>
        <Text style={styles.cardLabel}>👨‍⚕️ {item.doctor}</Text>
      </View>
      <Text style={styles.cardFooterText}>Tap for more info ⬇️</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Prescriptions</Text>

      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id}
        renderItem={renderPrescription}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Prescription Details</Text>

              {selectedPrescription && (
                <>
                  {/* Section 1 */}
                  <View style={styles.detailCard}>
                    <Text style={styles.detailHeader}>💊 Medicine Overview</Text>
                    <Text style={styles.detailItem}>Name: {selectedPrescription.medicine.name}</Text>
                    <Text style={styles.detailItem}>Dosage: {selectedPrescription.medicine.mg}</Text>
                    <Text style={styles.detailItem}>Frequency: {selectedPrescription.medicine.frequency}</Text>
                    <Text style={styles.detailItem}>Duration: {selectedPrescription.medicine.duration}</Text>
                  </View>

                  {/* Section 2 */}
                  <View style={styles.detailCard}>
                    <Text style={styles.detailHeader}>🕒 Schedule & Intake</Text>
                    <Text style={styles.detailItem}>Time: {selectedPrescription.medicine.schedule}</Text>
                    <Text style={styles.detailItem}>How to take: {selectedPrescription.medicine.how}</Text>
                  </View>

                  {/* Section 3 */}
                  <View style={styles.detailCard}>
                    <Text style={styles.detailHeader}>📋 Usage & Warnings</Text>
                    <Text style={styles.detailItem}>Usage: {selectedPrescription.medicine.usage}</Text>
                    <Text style={styles.detailItem}>Side Effects: {selectedPrescription.medicine.sideEffects}</Text>
                    <Text style={styles.detailItem}>Precautions: {selectedPrescription.medicine.precautions}</Text>
                  </View>
                </>
              )}

              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const purple = '#9B59B6';
const lightPurple = '#f4ebfa';
const white = '#ffffff';
const darkText = '#333';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: purple,
    marginBottom: 20,
  },
  prescriptionCard: {
    backgroundColor: lightPurple,
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C3483',
    marginBottom: 8,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 14,
    color: '#5D3A9B',
    fontWeight: '500',
  },
  cardFooterText: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: white,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: purple,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#f8f0fc',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: purple,
  },
  detailHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C3483',
    marginBottom: 6,
  },
  detailItem: {
    fontSize: 14,
    color: darkText,
    marginBottom: 2,
  },
  closeButton: {
    backgroundColor: purple,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: white,
    fontWeight: '600',
    fontSize: 16,
  },
});
