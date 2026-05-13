import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius } from '../theme';
import { createPost, getCategories } from '../services/api';

export default function CreatePostScreen({ navigation, route }) {
  const { token } = route.params || {};
  const [postType, setPostType] = useState('LOST');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
      if (res.data.length > 0) setCategoryId(res.data[0].id);
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Leje', 'Duhet leje per galeri!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Leje', 'Duhet leje per kamere!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !city || !incidentDate) {
      Alert.alert('Gabim', 'Ploteso te gjitha fushat!');
      return;
    }
    setLoading(true);
    try {
      await createPost({
        post_type: postType,
        title,
        description,
        city,
        incident_date: incidentDate,
        category_id: categoryId,
      }, token);
      Alert.alert('Sukses!', 'Postimi u shtua!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.log('Error:', err.response?.data);
      Alert.alert('Gabim', 'Dicka shkoi keq!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Krijo Postim</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Lloji</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, postType === 'LOST' && styles.typeButtonLost]}
              onPress={() => setPostType('LOST')}
            >
              <Text style={[styles.typeButtonText, postType === 'LOST' && styles.typeButtonTextActive]}>
                I Humbur
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, postType === 'FOUND' && styles.typeButtonFound]}
              onPress={() => setPostType('FOUND')}
            >
              <Text style={[styles.typeButtonText, postType === 'FOUND' && styles.typeButtonTextActive]}>
                I Gjetur
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Kategoria</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, categoryId === cat.id && styles.categoryChipActive]}
                onPress={() => setCategoryId(cat.id)}
              >
                <Text style={[styles.categoryChipText, categoryId === cat.id && styles.categoryChipTextActive]}>
                  {cat.icon} {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Titulli</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Telefon i humbur"
              placeholderTextColor={colors.textLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <Text style={styles.label}>Pershkrimi</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Pershkruaj sendin..."
              placeholderTextColor={colors.textLight}
              value={description}
              onChangeText={setDescription}
              multiline={true}
            />
          </View>

          <Text style={styles.label}>Qyteti</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Prishtine"
              placeholderTextColor={colors.textLight}
              value={city}
              onChangeText={setCity}
            />
          </View>

          <Text style={styles.label}>Data (YYYY-MM-DD)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="2026-04-19"
              placeholderTextColor={colors.textLight}
              value={incidentDate}
              onChangeText={setIncidentDate}
            />
          </View>

          <Text style={styles.label}>Foto</Text>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity style={styles.removeImage} onPress={() => setImage(null)}>
                <Ionicons name="close-circle" size={28} color={colors.lost} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={24} color={colors.primary} />
                <Text style={styles.photoButtonText}>Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={24} color={colors.primary} />
                <Text style={styles.photoButtonText}>Kamera</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.textWhite} />
            ) : (
              <Text style={styles.buttonText}>Publiko</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, height: '100vh' },
container: { backgroundColor: colors.background },
  scrollContent: { paddingBottom: 150 },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: colors.textWhite },
  form: { padding: spacing.lg },
  label: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  typeContainer: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  typeButton: {
    flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md,
    borderWidth: 2, borderColor: colors.border, alignItems: 'center',
    backgroundColor: colors.surface,
  },
  typeButtonLost: { borderColor: colors.lost, backgroundColor: colors.lostLight },
  typeButtonFound: { borderColor: colors.found, backgroundColor: colors.foundLight },
  typeButtonText: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
  typeButtonTextActive: { color: colors.textPrimary },
  categoriesContainer: { marginBottom: spacing.lg },
  categoryChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.round, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm,
  },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryChipText: { color: colors.textSecondary, fontSize: 14 },
  categoryChipTextActive: { color: colors.textWhite, fontWeight: 'bold' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, marginBottom: spacing.lg, minHeight: 52,
  },
  textAreaContainer: { alignItems: 'flex-start', paddingVertical: spacing.sm },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, color: colors.textPrimary, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  photoButtons: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  photoButton: {
    flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md,
    borderWidth: 2, borderColor: colors.border, alignItems: 'center',
    backgroundColor: colors.surface, gap: spacing.xs,
  },
  photoButtonText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  imageContainer: { position: 'relative', marginBottom: spacing.lg },
  image: { width: '100%', height: 200, borderRadius: borderRadius.md },
  removeImage: { position: 'absolute', top: 8, right: 8 },
  button: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  buttonText: { color: colors.textWhite, fontSize: 18, fontWeight: 'bold' },
});