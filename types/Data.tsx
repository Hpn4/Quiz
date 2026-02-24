import { Topic } from "@/types/Topic";
import { Quiz } from "@/types/Quiz";

const topics: Record<string, Topic> = {
  math: require('@/assets/content/math/index.json'),
};

const mathQuiz: Record<string, Quiz> = {
  groupe: require('@/assets/content/math/groupe.json'),
  proba: require('@/assets/content/math/proba.json'),
};

const topicsToQuiz: Record<string, Record<string, Quiz>> = {
  math: mathQuiz,
};

export function getTopics(): Topic[] {
  return Object.values(topics) as Topic[];
}

export function getTopic(slug: string): Topic {
  return topics[slug];
}

export function getQuizs(topic_slug: string): Quiz[] {
  return Object.values(topicsToQuiz[topic_slug] || {});
}

export function getQuiz(topic_slug: string, quiz_slug: string): Quiz {
  return topicsToQuiz[topic_slug][quiz_slug];
}