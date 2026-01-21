import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { API_BASE_URL } from '../config/api';
import { waitlistStyles } from '../styles/waitlistStyles';

export default function WaitlistScreen() {
  const [tripId, setTripId] = useState('trip-123');
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle joining the waitlist
   */
  const handleJoinWaitlist = async () => {
    if (!tripId.trim()) {
      Alert.alert('Error', 'Please enter a Trip ID');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/waitlist/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: tripId.trim(),
          name: name.trim(),
          email: email.trim(),
        }),
      });
      console.log('response', response);
      const data = await response.json();
      console.log('data', data);
      if (response.ok) {
        setPosition(data.position);
        Alert.alert(
          'Success',
          `You've joined the waitlist!\nYou're #${data.position} in line`
        );
      } else {
        setError(data.error || 'Failed to join waitlist');
        Alert.alert('Error', data.error || 'Failed to join waitlist');
      }
    } catch (err) {
      const errorMessage = 'Could not connect to server. Make sure backend is running on http://localhost:3000';
      setError(errorMessage);
      Alert.alert('Connection Error', errorMessage);
      console.error('Error joining waitlist:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle checking current position in waitlist
   */
  const handleCheckPosition = async () => {
    if (!tripId.trim()) {
      Alert.alert('Error', 'Please enter a Trip ID');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const encodedEmail = encodeURIComponent(email.trim());
      const response = await fetch(
        `${API_BASE_URL}/waitlist/position/${tripId.trim()}/${encodedEmail}`
      );

      const data = await response.json();

      if (response.ok) {
        setPosition(data.position);
        Alert.alert('Your Position', `You're #${data.position} in line`);
      } else {
        setError(data.error || 'Failed to check position');
        Alert.alert('Error', data.error || 'Failed to check position');
      }
    } catch (err) {
      const errorMessage = 'Could not connect to server. Make sure backend is running on http://localhost:3000';
      setError(errorMessage);
      Alert.alert('Connection Error', errorMessage);
      console.error('Error checking position:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle simulating spot opening (for testing)
   */
  const handleSpotOpened = async () => {
    if (!tripId.trim()) {
      Alert.alert('Error', 'Please enter a Trip ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/waitlist/spot-opened/${tripId.trim()}`,
        {
          method: 'POST',
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Spot Opened',
          `${data.notifiedUser.name} was notified!\nRemaining in line: ${data.remainingInLine}`
        );
        // Refresh position if user is on waitlist
        if (position) {
          handleCheckPosition();
        }
      } else {
        setError(data.error || 'Failed to process spot opening');
        Alert.alert('Error', data.error || 'Failed to process spot opening');
      }
    } catch (err) {
      const errorMessage = 'Could not connect to server. Make sure backend is running on http://localhost:3000';
      setError(errorMessage);
      Alert.alert('Connection Error', errorMessage);
      console.error('Error opening spot:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={waitlistStyles.container}>
      <ScrollView
        contentContainerStyle={waitlistStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <Text style={waitlistStyles.title}>Trip Waitlist</Text>

        <View style={waitlistStyles.section}>
          <Text style={waitlistStyles.label}>Trip ID:</Text>
          <TextInput
            style={waitlistStyles.input}
            value={tripId}
            onChangeText={setTripId}
            placeholder="Enter Trip ID"
            placeholderTextColor="#999"
            editable={!loading}
          />
        </View>

        <View style={waitlistStyles.section}>
          <Text style={waitlistStyles.label}>Name:</Text>
          <TextInput
            style={waitlistStyles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            editable={!loading}
            autoCapitalize="words"
          />
        </View>

        <View style={waitlistStyles.section}>
          <Text style={waitlistStyles.label}>Email:</Text>
          <TextInput
            style={waitlistStyles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {position !== null && (
          <View style={waitlistStyles.positionCard}>
            <Text style={waitlistStyles.positionLabel}>Your Position</Text>
            <Text style={waitlistStyles.positionNumber}>#{position}</Text>
            <Text style={waitlistStyles.positionText}>in line</Text>
          </View>
        )}

        {error && (
          <View style={waitlistStyles.errorCard}>
            <Text style={waitlistStyles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            waitlistStyles.button,
            waitlistStyles.primaryButton,
            loading && waitlistStyles.buttonDisabled,
          ]}
          onPress={handleJoinWaitlist}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={waitlistStyles.buttonText}>Join Waitlist</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            waitlistStyles.button,
            waitlistStyles.secondaryButton,
            loading && waitlistStyles.buttonDisabled,
          ]}
          onPress={handleCheckPosition}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#0066cc" />
          ) : (
            <Text style={waitlistStyles.secondaryButtonText}>Refresh Position</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            waitlistStyles.button,
            waitlistStyles.testButton,
            loading && waitlistStyles.buttonDisabled,
          ]}
          onPress={handleSpotOpened}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={waitlistStyles.testButtonText}>
            [Test] Simulate Spot Opening
          </Text>
        </TouchableOpacity>

        <View style={waitlistStyles.infoBox}>
          <Text style={waitlistStyles.infoText}>
            💡 Make sure the backend server is running on http://localhost:3000
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
