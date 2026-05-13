import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';
import { getPosts, getCategories } from '../services/api';

export default function HomeScreen({ navigation,route}) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('');
const [sortBy, setSortBy] = useState('newest');
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, catsRes] = await Promise.all([
        getPosts({}),
        getCategories(),
      ]);
      setPosts(postsRes.data.data || []);
      setCategories(catsRes.data || []);
    } catch (err) {
      console.log('Error:', err);
    } finally {
      setLoading(false);
    }
  };

 const filteredPosts = posts
  .filter(post => {
    const matchType = selectedType === 'ALL' || post.post_type === selectedType;
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchCity = selectedCity === '' || post.location?.city?.toLowerCase().includes(selectedCity.toLowerCase());
    return matchType && matchSearch && matchCity;
  })
  .sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    return 0;
  });

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.card}>
        {item.photos && item.photos.length > 0 && (
      <Image 
        source={{ uri: `http://192.168.178.64:8000/storage/${item.photos[0].photo_url}` }} 
        style={styles.cardImage}
      />
    )}
      <View style={[
        styles.badge,
        { backgroundColor: item.post_type === 'LOST' ? colors.lostLight : colors.foundLight }
      ]}>
        <Text style={[
          styles.badgeText,
          { color: item.post_type === 'LOST' ? colors.lost : colors.found }
        ]}>
          {item.post_type === 'LOST' ? '🔴 I Humbur' : '🟢 I Gjetur'}
        </Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.cardInfo}>
          <Ionicons name="location-outline" size={14} color={colors.textLight} />
          <Text style={styles.cardInfoText}>{item.location?.city || 'Kosovë'}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
          <Text style={styles.cardInfoText}>{item.incident_date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
  <View>
    <Text style={styles.headerTitle}>KuT'Humbi 🌿</Text>
    <Text style={styles.headerSubtitle}>Gjej sendet e humbura</Text>
  </View>
  <View style={styles.headerButtons}>
    <TouchableOpacity 
      style={styles.addButton}
      onPress={() => navigation.navigate('CreatePost', { token: route.params?.token })}
    >
      <Ionicons name="add" size={28} color={colors.textWhite} />
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.addButton}
      onPress={() => navigation.replace('Login')}
    >
      <Ionicons name="log-out-outline" size={28} color={colors.textWhite} />
    </TouchableOpacity>
  </View>
</View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Kërko sende..."
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* Filter by City */}
<View style={styles.searchContainer}>
  <Ionicons name="location-outline" size={20} color={colors.textLight} />
  <TextInput
    style={styles.searchInput}
    placeholder="Filtro sipas qytetit..."
    placeholderTextColor={colors.textLight}
    value={selectedCity}
    onChangeText={setSelectedCity}
  />
</View>

{/* Sort */}
<View style={styles.sortContainer}>
  <Text style={styles.sortLabel}>Rendit:</Text>
  {['newest', 'oldest'].map(sort => (
    <TouchableOpacity
      key={sort}
      style={[styles.sortTab, sortBy === sort && styles.sortTabActive]}
      onPress={() => setSortBy(sort)}
    >
      <Text style={[styles.sortTabText, sortBy === sort && styles.sortTabTextActive]}>
        {sort === 'newest' ? '🕐 Më të reja' : '🕐 Më të vjetra'}
      </Text>
    </TouchableOpacity>
  ))}
</View>

      <View style={styles.filterContainer}>
        {['ALL', 'LOST', 'FOUND'].map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.filterTab, selectedType === type && styles.filterTabActive]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[
              styles.filterTabText,
              selectedType === type && styles.filterTabTextActive
            ]}>
              {type === 'ALL' ? 'Të gjitha' : type === 'LOST' ? 'Të humbura' : 'Të gjetura'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search" size={64} color={colors.primaryLight} />
              <Text style={styles.emptyText}>Nuk ka postime!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    

  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.textWhite },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  addButton: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, margin: spacing.md,
    borderRadius: borderRadius.md, paddingHorizontal: spacing.md,
    height: 48, borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, marginLeft: spacing.sm, color: colors.textPrimary, fontSize: 15 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  filterTab: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.round, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  filterTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterTabText: { color: colors.textSecondary, fontSize: 14 },
  filterTabTextActive: { color: colors.textWhite, fontWeight: 'bold' },
  list: { padding: spacing.md, paddingTop: spacing.sm },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.md, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  badge: {
    alignSelf: 'flex-start', paddingHorizontal: spacing.sm,
    paddingVertical: 4, borderRadius: borderRadius.round, marginBottom: spacing.sm,
  },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: colors.textPrimary, marginBottom: spacing.xs },
  cardDescription: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  cardFooter: { flexDirection: 'row', gap: spacing.md },
  cardInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardInfoText: { fontSize: 12, color: colors.textLight },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: 18, color: colors.textLight, marginTop: spacing.md },
  sortContainer: {
  flexDirection: 'row', alignItems: 'center',
  paddingHorizontal: spacing.md, marginBottom: spacing.sm, gap: spacing.sm,
},
sortLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
sortTab: {
  paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  borderRadius: borderRadius.round, backgroundColor: colors.surface,
  borderWidth: 1, borderColor: colors.border,
},
sortTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
sortTabText: { color: colors.textSecondary, fontSize: 13 },
sortTabTextActive: { color: colors.textWhite, fontWeight: 'bold' },
cardImage: {
  width: '100%',
  height: 160,
  borderRadius: borderRadius.md,
  marginBottom: spacing.sm,
},
});