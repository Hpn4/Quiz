import { Topic } from "@/types/Topic";
import { Quiz } from "@/types/Quiz";

const topics: Record<string, Topic> = {
  math: require('@/assets/content/math/index.json'),
  medical: require('@/assets/content/medical/index.json'),
};

const mathQuiz: Record<string, Quiz> = {
  groupe: require('@/assets/content/math/groupe.json'),
  proba: require('@/assets/content/math/proba.json'),
};

const medicalQuiz: Record<string, Quiz> = {
  lombalgie: require('@/assets/content/medical/lombalgie.json'),
};

const topicsToQuiz: Record<string, Record<string, Quiz>> = {
  math: mathQuiz,
  medical: medicalQuiz,
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

export function getGlossary(): Record<string, string> {
  const map: Record<string, string> = {};
  // Aggregate glossary entries defined at the quiz level across all topics
  Object.values(topicsToQuiz).forEach((qmap: any) => {
    Object.values(qmap).forEach((q: any) => {
      if (q && q.glossary && Array.isArray(q.glossary)) {
        q.glossary.forEach((g: any) => {
          if (g.term && g.definition) map[g.term] = g.definition;
        });
      }
    });
  });
  return map;
}