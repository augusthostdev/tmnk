import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from 'nativewind';

import { getColor } from '@/utils/colors';
import { monksData, type Monk } from '@/data/monks';

const FILTERS = ['All', 'Favorites', 'Recent', 'Groups', 'Family'];

function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return parts
      .slice(0, 2)
      .map((p) => p[0])
      .join('');
  }
  return name.slice(0, 2).toUpperCase();
}

function groupMonksByFirstLetter(monks: Monk[]): Record<string, Monk[]> {
  return monks.reduce((acc, monk) => {
    const firstLetter = monk.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(monk);
    return acc;
  }, {} as Record<string, Monk[]>);
}

export default function MonksScreen() {
  const { colorScheme } = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredMonks = useMemo(() => {
    let filtered = monksData;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (monk) =>
          monk.name.toLowerCase().includes(query) ||
          monk.standard.toLowerCase().includes(query) ||
          monk.class.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery]);

  const groupedMonks = useMemo(() => {
    return groupMonksByFirstLetter(filteredMonks);
  }, [filteredMonks]);

  const backgroundColor = getColor(colorScheme, 'background');
  const textColor = getColor(colorScheme, 'text');
  const borderColor = getColor(colorScheme, 'border');

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text
          className="text-2xl font-bold"
          style={{ color: textColor }}
        >
          Monks Database
        </Text>
        <TouchableOpacity
          className="w-12 h-12 rounded-lg items-center justify-center"
          style={{ backgroundColor: '#FED600' }}
        >
          <Text className="text-3xl font-light text-black">+</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 pb-3">
        <View
          className="flex-row items-center rounded-xl px-4 py-3"
          style={{ backgroundColor: getColor(colorScheme, 'border') }}
        >
          <FontAwesome
            name="search"
            size={18}
            color={getColor(colorScheme, 'tabIconDefault')}
          />
          <TextInput
            className="flex-1 ml-3 text-base"
            style={{ color: textColor }}
            placeholder="Search monks, standards, classes..."
            placeholderTextColor={getColor(colorScheme, 'tabIconDefault')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: 12, alignItems: 'center' }}
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className="px-4 py-1.5 rounded-full mr-2 items-center justify-center"
              style={{
                backgroundColor: isActive ? '#FED600' : getColor(colorScheme, 'border'),
              }}
            >
              <Text
                className="font-medium"
                style={{
                  color: isActive ? '#000' : textColor,
                }}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Monks List */}
      <ScrollView className="flex-1 px-4">
        {Object.keys(groupedMonks).length === 0 ? (
          <View className="items-center py-10">
            <Text
              className="text-base"
              style={{ color: getColor(colorScheme, 'tabIconDefault') }}
            >
              No monks found
            </Text>
          </View>
        ) : (
          Object.entries(groupedMonks).map(([letter, monks]) => (
            <View key={letter} className="mb-4">
              {/* Section Header */}
              <View
                className="px-3 py-2 mb-2"
                style={{ backgroundColor: getColor(colorScheme, 'border') }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: getColor(colorScheme, 'tabIconDefault') }}
                >
                  {letter}
                </Text>
              </View>

              {/* Monks in Section */}
              {monks.map((monk) => (
                <TouchableOpacity
                  key={monk.id}
                  className="flex-row items-center py-3 border-b"
                  style={{ borderBottomColor: borderColor }}
                >
                  {/* Avatar */}
                  {monk.avatar ? (
                    <Image
                      source={{ uri: monk.avatar }}
                      className="w-14 h-14 rounded-full mr-4"
                    />
                  ) : (
                    <View
                      className="w-14 h-14 rounded-full items-center justify-center mr-4"
                      style={{
                        backgroundColor: monk.initials ? '#FED600' : getColor(colorScheme, 'border'),
                      }}
                    >
                      <Text
                        className="text-lg font-bold"
                        style={{ color: monk.initials ? '#000' : textColor }}
                      >
                        {monk.initials || getInitials(monk.name)}
                      </Text>
                    </View>
                  )}

                  {/* Info */}
                  <View className="flex-1">
                    <Text
                      className="text-lg font-semibold mb-1"
                      style={{ color: textColor }}
                    >
                      {monk.name}
                    </Text>
                    <Text
                      className="text-base"
                      style={{ color: getColor(colorScheme, 'tabIconDefault') }}
                    >
                      Standard: {monk.standard}, Class: {monk.class}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
        {/* Bottom padding for tab bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
