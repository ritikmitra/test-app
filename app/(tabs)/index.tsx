import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/color';
import { Link } from 'expo-router';

const index = () => {

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Link href={"/(screens)/Profile"} style={styles.profileButton}>
          <Ionicons name='person-outline' size={24} color='white' />
        </Link>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {['Overview', 'Statistics', 'Tasks', 'Settings'].map((title, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardText}>This is a section about {title.toLowerCase()}.</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 100,
    boxShadow : '0px 2px 3.5px rgba(0,0,0,0.2)'
  },
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5, // Adds shadow for Android
    boxShadow: '0px 2px 3.5px rgba(0,0,0,0.2)'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
