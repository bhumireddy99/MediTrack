import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const reminders = [
  {
    id: 1,
    time: '8:00 AM',
    name: 'Thyronorm',
    message: 'Time to take your morning dose.',
    status: 'Taken',
  },
  {
    id: 2,
    time: '4:00 PM',
    name: 'Paracetamol',
    message: 'Scheduled for the afternoon.',
    status: 'Upcoming',
  },
  {
    id: 3,
    time: '10:00 PM',
    name: 'Vitamin D',
    message: 'Don’t forget your night supplement.',
    status: 'Upcoming',
  },
];

export default function ReminderScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>💡 Reminders</Text>
        <Text style={styles.subHeader}>Here's what you need to take today</Text>

        {reminders.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.name}>💊 {item.name}</Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>

            <View style={styles.cardRight}>
              {item.status === 'Taken' ? (
                <Text style={styles.statusTaken}>✓ Taken</Text>
              ) : (
                <TouchableOpacity style={styles.takeBtn}>
                  <Text style={styles.takeBtnText}>Mark as Taken</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  scroll: {
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 15,
    color: '#777',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E3F3',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flex: 1,
    paddingRight: 10,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7B47F5',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#555',
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  statusTaken: {
    color: '#28C76F',
    fontSize: 13,
    fontWeight: '600',
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
});
