import React from 'react';
import { View, Text, Button } from 'react-native';

const LanguageScreen = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Select Your Language</Text>
      <Button title="English" onPress={() => alert('Language changed to English')} />
      <Button title="हिन्दी" onPress={() => alert('भाषा हिंदी में बदली गई')} />
      <Button title="ગુજરાતી" onPress={() => alert('ભાષા ગુજરાતીમાં બદલાઈ')} />
    </View>
  );
};

export default LanguageScreen;