import React from "react";

import { Quiz } from "@/types/Quiz";
import Card from "@/components/Card";

interface QuizCardProps {
  topic_slug: string;
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ topic_slug, quiz }) => {
  return (
    <Card href={{
      pathname: '/[topic_slug]/[slug]/',
      params: {
        topic_slug: topic_slug,
        slug: quiz.slug,
      }
    }} image={quiz.image} title={quiz.name}/>
  );
};

export default QuizCard;
