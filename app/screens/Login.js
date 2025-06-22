import React, { useState } from 'react';
import {
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const LoginScreen = () => {
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <View style={styles.iconBox}>
                    <Text style={styles.exclamation}>!</Text>
                </View>

                <Text style={styles.title}>Meditrack</Text>
                <Text style={styles.subtitle}>Patient Portal</Text>

                <Text style={styles.label}>Mobile Number / Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter mobile or email"
                    value={emailOrMobile}
                    onChangeText={setEmailOrMobile}
                    keyboardType="email-address"
                    placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="●●●●●●"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#aaa"
                />

                <View style={styles.row}>
                    <Pressable
                        onPress={() => setRememberMe(!rememberMe)}
                        style={styles.checkboxWrapper}
                    >
                        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
                        <Text style={styles.checkboxLabel}>Remember me</Text>
                    </Pressable>
                    <TouchableOpacity>
                        <Text style={styles.link}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.signInButton}>
                    <Text style={styles.signInText}>Sign in</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0077b6',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    iconBox: {
        backgroundColor: '#0077b6',
        alignSelf: 'center',
        paddingHorizontal: 15,
        paddingVertical: 7.5,
        borderRadius: 8,
        marginBottom: 10,
    },
    exclamation: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#888',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginTop: 10,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#999',
        marginRight: 6,
        borderRadius: 4,
    },
    checkboxChecked: {
        backgroundColor: '#0077b6',
        borderColor: '#0077b6',
    },
    checkboxLabel: {
        color: '#333',
    },
    link: {
        color: '#0077b6',
        fontWeight: '500',
    },
    signInButton: {
        backgroundColor: '#0077b6',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    signInText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footerText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#444',
    },
});
