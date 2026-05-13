import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { register } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Gabim', 'Plotëso të gjitha fushat!');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Gabim', 'Fjalëkalimet nuk përputhen!');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Gabim', 'Fjalëkalimi duhet të ketë minimum 8 karaktere!');
      return;
    }
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      Alert.alert('Sukses!', 'Llogaria u krijua!', [
  { text: 'OK', onPress: () => navigation.replace('Home') }
]);
   } catch (err) {
  console.log('Register error:', err.response?.data);
  Alert.alert('Gabim', JSON.stringify(err.response?.data));
}
     finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Krijo Llogari</Text>
        <Text style={styles.headerSubtitle}>Bashkohu me komunitetin 🌿</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Emri i plotë"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Fjalëkalimi"
            placeholderTextColor={colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={showPassword === false}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Konfirmo fjalëkalimin"
            placeholderTextColor={colors.textLight}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={showPassword === false}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <Text style={styles.buttonText}>Regjistrohu</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Ke llogari? <Text style={styles.loginTextBold}>Hyr</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.xs,
  },
  form: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    height: 52,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  loginTextBold: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});