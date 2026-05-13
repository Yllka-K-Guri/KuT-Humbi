import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { login } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Gabim', 'Plotëso të gjitha fushat!');
      return;
    }
    setLoading(true);
    try {
      const res = await login({ email, password });
      const token = res.data.token;
      navigation.replace('Home', { token });
    } catch (err) {
      Alert.alert('Gabim', JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="search" size={48} color={colors.textWhite} />
        </View>
        <Text style={styles.appName}>KuT'Humbi</Text>
        <Text style={styles.tagline}>Gjej sendet e humbura 🌿</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.title}>Hyr në llogari</Text>

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
            autoCorrect={false}
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

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <Text style={styles.buttonText}>Hyr</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>
            Nuk ke llogari? <Text style={styles.registerTextBold}>Regjistrohu</Text>
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
    paddingTop: 80,
    paddingBottom: 48,
    alignItems: 'center',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textWhite,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
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
  registerLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  registerTextBold: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});