import { Link } from 'expo-router';
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Quiz } from "@/types/Quiz";

interface QuizCardProps {
  topic_slug: string;
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ topic_slug, quiz }) => {
  return (
    <Link
        href={{
          pathname: '/[topic_slug]/[slug]/',
          params: {
            topic_slug: topic_slug,
            slug: quiz.slug,
          }
        }} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: quiz.image }} style={quiz.image} />
        <Text style={styles.title}>{quiz.name}</Text>
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

export default QuizCard;
