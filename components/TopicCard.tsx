import { Link } from 'expo-router';
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Topic } from "@/types/Topic";

interface TopicCardProps {
  topic: Topic;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <Link
        href={{
          pathname: '/[slug]/',
          params: { slug: topic.slug }
        }} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: topic.image }} style={styles.image} />
        <Text style={styles.title}>{topic.name}</Text>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "45%",
    height: 140,
    backgroundColor: "#303030",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 30,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default TopicCard;
