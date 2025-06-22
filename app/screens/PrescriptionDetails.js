import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function PrescriptionDetailScreen({ route }) {
    const { prescription } = route.params;
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (medicine) => {
        setSelectedMedicine(medicine);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedMedicine(null);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Prescription Overview</Text>
            <View style={styles.cardTop}>
                <Text style={styles.diseaseText}>{prescription.disease}</Text>
                <Text style={styles.metaText}>👨‍⚕️ {prescription.doctor}</Text>
                <Text style={styles.metaText}>🏥 {prescription.hospital}</Text>
            </View>

            <Text style={styles.sectionTitle}>Medicines</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                {prescription.medicines.map((medicine, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.medicineCard}
                        onPress={() => openModal(medicine)}
                    >
                        <View style={styles.medicineInfo}>
                            <Ionicons name="medkit-outline" size={20} color={colors.primary} />
                            <Text style={styles.medicineName}>{medicine.name}</Text>
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
                    <LinearGradient colors={[colors.primary, colors.accent]} style={styles.modalCardWrapper}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeader}>{selectedMedicine?.name}</Text>

                            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                                <View style={styles.modalItemBox}><Text style={styles.modalLabel}>💊 Dosage:</Text><Text style={styles.modalValue}>{selectedMedicine?.mg}</Text></View>
                                <View style={styles.modalItemBox}><Text style={styles.modalLabel}>📆 Frequency:</Text><Text style={styles.modalValue}>{selectedMedicine?.frequency}</Text></View>
                                <View style={styles.modalItemBox}><Text style={styles.modalLabel}>⏳ Duration:</Text><Text style={styles.modalValue}>{selectedMedicine?.duration}</Text></View>
                                <View style={styles.modalItemBox}><Text style={styles.modalLabel}>🕒 Schedule:</Text><Text style={styles.modalValue}>{selectedMedicine?.schedule}</Text></View>
                                <View style={styles.modalItemBox}><Text style={styles.modalLabel}>💡 How to Take:</Text><Text style={styles.modalValue}>{selectedMedicine?.how}</Text></View>
                                <View style={styles.modalItemBox}><Text style={styles.modalLabel}>📋 Usage:</Text><Text style={styles.modalValue}>{selectedMedicine?.usage}</Text></View>
                                <View style={styles.modalItemBox}><Text style={styles.modalLabel}>⚠️ Side Effects:</Text><Text style={styles.modalValue}>{selectedMedicine?.sideEffects}</Text></View>
                                <View style={styles.modalItemBox}><Text style={styles.modalLabel}>🛑 Precautions:</Text><Text style={styles.modalValue}>{selectedMedicine?.precautions}</Text></View>
                            </ScrollView>

                            <Pressable style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </Pressable>
                        </View>
                    </LinearGradient>
                </View>
            </Modal>
        </View>
    );
}

const colors = {
    background: '#F5F7FA',
    card: '#FFFFFF',
    primary: '#6C5CE7',
    accent: '#A29BFE',
    text: '#2D3436',
    muted: '#636e72',
    overlay: 'rgba(0,0,0,0.4)'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 20,
    },
    cardTop: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    diseaseText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 10,
    },
    metaText: {
        fontSize: 14,
        color: colors.muted,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    medicineInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    medicineName: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCardWrapper: {
        width: width * 0.9,
        borderRadius: 24,
        padding: 2,
    },
    modalContent: {
        backgroundColor: colors.card,
        borderRadius: 22,
        padding: 20,
        maxHeight: height * 0.75,
    },
    modalHeader: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 14,
        textAlign: 'center',
    },
    modalScroll: {
        marginBottom: 16,
    },
    modalItemBox: {
        marginBottom: 10,
    },
    modalLabel: {
        fontSize: 13,
        fontWeight: '600',
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
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});