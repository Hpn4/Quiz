import { Topic } from "@/types/Topic";
import { Quiz } from "@/types/Quiz";
import { FlatQuestion } from "@/types/Session";

const topics: Record<string, Topic> = {
  math: require('@/assets/content/math/index.json'),
  ostheo: require('@/assets/content/ostheo/index.json'),
};

const mathQuiz: Record<string, Quiz> = {
  groupe: require('@/assets/content/math/groupe.json'),
  proba: require('@/assets/content/math/proba.json'),
  textinput: require('@/assets/content/math/textinput.json'),
};

const ostheoQuiz: Record<string, Quiz> = {
  lombalgie: require('@/assets/content/ostheo/lombalgie.json'),
  dtm: require('@/assets/content/ostheo/dtm.json'),
  epaule: require('@/assets/content/ostheo/epaule.json'),
  coude: require('@/assets/content/ostheo/coude.json'),
  poignet: require('@/assets/content/ostheo/poignet.json'),
  main: require('@/assets/content/ostheo/main.json'),
  hanche: require('@/assets/content/ostheo/hanche.json'),
  genou: require('@/assets/content/ostheo/genou.json'),
  cheville: require('@/assets/content/ostheo/cheville.json'),
  pied: require('@/assets/content/ostheo/pied.json'),
};

const topicsToQuiz: Record<string, Record<string, Quiz>> = {
  math: mathQuiz,
  ostheo: ostheoQuiz,
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

function quizToFlat(topicSlug: string, quizSlug: string, quiz: Quiz): FlatQuestion[] {
  return (quiz.questions ?? []).map((question, questionIndex) => ({
    topicSlug,
    quizSlug,
    questionIndex,
    question,
  }));
}

export function getQuizFlatQuestions(topicSlug: string, quizSlug: string): FlatQuestion[] {
  const quiz = topicsToQuiz[topicSlug]?.[quizSlug];
  return quiz ? quizToFlat(topicSlug, quizSlug, quiz) : [];
}

export function getTopicFlatQuestions(topicSlug: string): FlatQuestion[] {
  const quizMap = topicsToQuiz[topicSlug] ?? {};
  return Object.entries(quizMap).flatMap(([quizSlug, quiz]) =>
    quizToFlat(topicSlug, quizSlug, quiz)
  );
}

export function getAllFlatQuestions(): FlatQuestion[] {
  return Object.entries(topicsToQuiz).flatMap(([topicSlug, quizMap]) =>
    Object.entries(quizMap).flatMap(([quizSlug, quiz]) =>
      quizToFlat(topicSlug, quizSlug, quiz)
    )
  );
}

export function getAllQuizList(): { topicSlug: string; quizSlug: string }[] {
  return Object.entries(topicsToQuiz).flatMap(([topicSlug, quizMap]) =>
    Object.keys(quizMap).map((quizSlug) => ({ topicSlug, quizSlug }))
  );
}
