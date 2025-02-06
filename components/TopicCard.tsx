import React from "react";

import { Topic } from "@/types/Topic";

import Card from "@/components/Card";

interface TopicCardProps {
  topic: Topic;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <Card href={{
      pathname: '/[slug]/',
      params: { slug: topic.slug }
    }} image={topic.image} title={topic.name}/>
  );
};

export default TopicCard;
