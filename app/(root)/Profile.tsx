import { View, Text, StyleSheet } from 'react-native';

const Profile = () => (
  <View style={styles.container}>
    <Text style={styles.text}>This is the Profile screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 }
});

export default Profile;
