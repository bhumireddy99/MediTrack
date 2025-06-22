import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const today = new Date().toDateString();

    const [medicines, setMedicines] = useState([
        { id: 1, time: '8:00 AM', name: 'Thyronorm', status: 'Taken' },
        { id: 2, time: '4:00 PM', name: 'Paracetamol', status: 'Upcoming' },
        { id: 3, time: '10:00 PM', name: 'Vitamin D', status: 'Upcoming' },
    ]);

    const handleMarkAsTaken = (id) => {
        const updated = medicines.map((med) =>
            med.id === id ? { ...med, status: 'Taken' } : med
        );
        setMedicines(updated);
    };

    const takenCount = medicines.filter(m => m.status === 'Taken').length;
    const upcomingCount = medicines.filter(m => m.status === 'Upcoming').length;
    const missedCount = 1;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Text style={styles.greeting}>Hello, Divya 👋</Text>
                <Text style={styles.subGreeting}>Here’s your health overview today.</Text>

                <View style={styles.highlightsRow}>
                    <View style={styles.highlightCard}>
                        <Text style={styles.highlightValue}>{takenCount}</Text>
                        <Text style={styles.highlightLabel}>Taken</Text>
                    </View>
                    <View style={styles.highlightCard}>
                        <Text style={styles.highlightValue}>{upcomingCount}</Text>
                        <Text style={styles.highlightLabel}>Upcoming</Text>
                    </View>
                    <View style={styles.highlightCard}>
                        <Text style={styles.highlightValue}>{missedCount}</Text>
                        <Text style={styles.highlightLabel}>Missed</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.labelBold}>Today:</Text>
                    <Text style={styles.sub}>{today}</Text>
                </View>

                <Text style={styles.sectionHeader}>Today's Medicines</Text>
                <View style={styles.card}>
                    {medicines.map((item) => (
                        <View key={item.id} style={styles.medRow}>
                            <View style={styles.timeBlock}>
                                <Text style={styles.time}>⏰ {item.time}</Text>
                                <Text style={styles.med}>💊 {item.name}</Text>
                            </View>

                            {item.status === 'Taken' ? (
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

                <TouchableOpacity style={styles.card}>
                    <Text style={styles.iconRow}>🩺 You have 2 active prescriptions</Text>
                    <Text style={styles.sub}>Tap to view in My Prescription</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.alertCard}>
                    <Text style={styles.iconRow}>❗ You have 1 missed dose today</Text>
                    <Text style={styles.sub}>Tap to open full Reminders</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFF',
    },
    scroll: {
        padding: 20,
    },
    greeting: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1E1E1E',
        marginBottom: 4,
    },
    subGreeting: {
        fontSize: 15,
        color: '#777',
        marginBottom: 20,
    },
    highlightsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    highlightCard: {
        backgroundColor: '#EFEAFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
        elevation: 1,
    },
    highlightValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#7B47F5',
    },
    highlightLabel: {
        fontSize: 13,
        color: '#555',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E3F3',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    alertCard: {
        backgroundColor: '#FFF0F0',
        borderColor: '#EA5455',
        borderWidth: 1,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    labelBold: {
        fontSize: 14,
        color: '#1E1E1E',
        fontWeight: '600',
    },
    sub: {
        fontSize: 13,
        color: '#777',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#1E1E1E',
    },
    timeBlock: {
        flex: 1,
        paddingRight: 10,
    },
    time: {
        fontWeight: '600',
        fontSize: 15,
        color: '#1E1E1E',
        marginBottom: 2,
    },
    med: {
        fontSize: 13,
        color: '#555',
    },
    medRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEAFF',
    },
    statusTaken: {
        color: '#28C76F',
        fontWeight: '700',
        fontSize: 13,
    },
    takeBtn: {
        backgroundColor: '#7B47F5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    takeBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    iconRow: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 4,
        color: '#1E1E1E',
    },
});

export default HomeScreen;
