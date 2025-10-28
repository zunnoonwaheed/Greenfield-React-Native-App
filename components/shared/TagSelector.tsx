import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface Tag {
  id: string;
  label: string;
}

interface TagSelectorProps {
  label?: string;
  tags: Tag[];
  selectedTags: string[];
  onToggle: (tagId: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ label, tags, selectedTags, onToggle }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsContainer}>
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <TouchableOpacity
              key={tag.id}
              style={[styles.tag, isSelected && styles.tagSelected]}
              onPress={() => onToggle(tag.id)}
            >
              <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{tag.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.medium,
  },
  label: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: Spacing.small,
  },
  tag: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  tagSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: Typography.bodySmall,
    color: Colors.text,
  },
  tagTextSelected: {
    color: Colors.white,
  },
});

export default TagSelector;
