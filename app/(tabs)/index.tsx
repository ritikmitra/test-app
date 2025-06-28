import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/color';
import { Link } from 'expo-router';

const API_URL_DRIVER = "https://f1connectapi.vercel.app/api/current/drivers-championship";
const API_URL_CONSTRUCTOR = "https://f1connectapi.vercel.app/api/current/constructors-championship";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('drivers'); // Either 'drivers' or 'constructors'
  const [drivers, setDrivers] = useState<any>([]);
  const [constructors, setConstructors] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  // Fetch driver data
  const fetchDriverData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_DRIVER);
      const data = await response.json();
      setDrivers(data.drivers_championship);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching driver data:', error);
      setLoading(false);
    }
  };

  // Fetch constructor data
  const fetchConstructorData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_CONSTRUCTOR);
      const data = await response.json();
      setConstructors(data.constructors_championship);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching constructor data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === 'drivers') {
      fetchDriverData();
    } else if (selectedTab === 'constructors') {
      fetchConstructorData();
    }
  }, [selectedTab]);

  const renderDriverTab = () => {
    return (
      <ScrollView style={styles.card}>
        {drivers.map((driver, index) => (
          <View key={index} style={styles.driverInfo}>
            <Text style={styles.driverName}>
              {driver.position}  {driver.driver.name} {driver.driver.surname}
            </Text>
            <Text style={styles.driverDetails}>Team: {driver.team.teamName}</Text>
            <Text style={styles.driverDetails}>Points: {driver.points}</Text>
            <Text style={styles.driverDetails}>Wins: {driver.wins}</Text>
            <Text style={styles.driverDetails}>Short Name: {driver.driver.shortName}</Text>
            <Link href={driver.driver.url} style={styles.link}>
              More Info on Wikipedia
            </Link>
          </View>
        ))}
        {loading && (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        )}
      </ScrollView>
    );
  };

  const renderConstructorTab = () => {
    return (
      <ScrollView style={styles.card}>
        {constructors.map((constructor, index) => (
          <View key={index} style={styles.constructorInfo}>
            <Text style={styles.cardTitle}>Constructor {constructor.position}</Text>
            <Text style={styles.constructorName}>
              {constructor.team.teamName}
            </Text>
            <Text style={styles.constructorDetails}>Country: {constructor.team.country}</Text>
            <Text style={styles.constructorDetails}>Points: {constructor.points}</Text>
            <Text style={styles.constructorDetails}>
              Constructors Championships: {constructor.team.constructorsChampionships}
            </Text>
            <Link href={constructor.team.url} style={styles.link}>
              More Info on Wikipedia
            </Link>
          </View>
        ))}
        {loading && (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Link href={"/(screens)/Profile"} style={styles.profileButton}>
          <Ionicons name="person-outline" size={24} color="white" />
        </Link>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'drivers' && styles.activeTab]}
          onPress={() => setSelectedTab('drivers')}
        >
          <Text style={styles.tabText}>Drivers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'constructors' && styles.activeTab]}
          onPress={() => setSelectedTab('constructors')}
        >
          <Text style={styles.tabText}>Constructors</Text>
        </TouchableOpacity>
      </View>

      {/* Render Data */}
      {selectedTab === 'drivers' ? renderDriverTab() : renderConstructorTab()}
    </View>
  );
};

export default Dashboard;

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
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tab: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: COLORS.textLight,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  driverInfo: {},
  driverName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  driverDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  constructorInfo: {},
  constructorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  constructorDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  link: {
    color: COLORS.primary,
    marginTop: 10,
    fontSize: 14,
  },
  loader: {
    marginVertical: 20,
  },
});
