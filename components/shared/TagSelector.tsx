/**
 * TagSelector - Multi-tag selector component
 * Add/remove specification tags
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TagSelectorProps {
  label: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  required?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  label,
  tags,
  onTagsChange,
  placeholder = 'Add a tag',
  required = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onTagsChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          placeholderTextColor="#9E9E9E"
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTag}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={28} color="#00A86B" />
        </TouchableOpacity>
      </View>

      {tags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
        >
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveTag(tag)}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Ionicons name="close-circle" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  required: {
    color: '#E53935',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    marginTop: 12,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A86B',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TagSelector;
