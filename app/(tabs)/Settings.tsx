import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { COLORS } from '@/constants/color';
import HotspotManager, { TetheringError } from "@react-native-tethering/hotspot"

const Settings = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = async () => {
    if (!isEnabled) {
      try {
        await HotspotManager.setHotspotEnabled(true);
        setIsEnabled(true);
        Alert.alert("Hotspot Error", "Hotspot is now enabled");
      } catch (error) {
        if (error instanceof TetheringError) {
          setIsEnabled(false);
          Alert.alert("Hotspot Turning", error.message);
        }
      }
    } else {
      try {
        await HotspotManager.setHotspotEnabled(false);
        setIsEnabled(false);
      } catch (error) {
        if (error instanceof TetheringError) {
          setIsEnabled(true);
          Alert.alert("Hotspot Error", error.message);
        }
      }
      Alert.alert("Hotspot Turning", "Hotspot is now disabled");
    }

  };

  async function CheckHotspot() {
    try {
      const state = await HotspotManager.isHotspotEnabled();
      setIsEnabled(state);
    } catch (error) {
      if (error instanceof TetheringError) {
        Alert.alert("Hotspot Turning", error.message);
      }
    }
  }

  useEffect(() => {
    CheckHotspot();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Hotspots and Tethering</Text>
        <Switch
          trackColor={{ false: COLORS.background, true: COLORS.primary }}
          thumbColor={isEnabled ? COLORS.white : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'sans-serif',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2, // for Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    boxShadow: "0 2 4 rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
});

export default Settings;

