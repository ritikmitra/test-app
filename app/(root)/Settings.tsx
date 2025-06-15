import { View, Text, StyleSheet, Switch, ToastAndroid, Button } from 'react-native';
import { useState } from 'react';
import { COLORS } from '@/constants/color';
import HotspotManager, { Device, TetheringError } from "@react-native-tethering/hotspot"

const Settings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [devices, setDevices] = useState<Device[]>([]);

  async function onPress(){
    try {
      const state = await HotspotManager.isHotspotEnabled();
      ToastAndroid.show(`Hotspot state: ${state}`, ToastAndroid.SHORT)
    } catch (error) {
      if (error instanceof TetheringError) {
        ToastAndroid.show(error.message, ToastAndroid.LONG)
      }
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Hotspots and Tethering</Text>
        <Button title='check' onPress={onPress}/>
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
    padding: 20,
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

