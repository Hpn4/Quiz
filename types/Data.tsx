import { Topic } from "@/types/Topic";
import { Quiz } from "@/types/Quiz";
import { FlatQuestion } from "@/types/Session";

const topics: Record<string, Topic> = {
  //math: require('@/assets/content/math/index.json'),
  osteo1: require('@/assets/content/osteo1/index.json'),
  osteo2: require('@/assets/content/osteo2/index.json'),
};

/*
const mathQuiz: Record<string, Quiz> = {
  groupe: require('@/assets/content/math/groupe.json'),
  proba: require('@/assets/content/math/proba.json'),
  textinput: require('@/assets/content/math/textinput.json'),
};
*/

const osteo1Quiz: Record<string, Quiz> = {
  lombalgie: require('@/assets/content/osteo1/lombalgie.json'),
  dtm: require('@/assets/content/osteo1/dtm.json'),
  epaule: require('@/assets/content/osteo1/epaule.json'),
  coude: require('@/assets/content/osteo1/coude.json'),
  poignet: require('@/assets/content/osteo1/poignet.json'),
  main: require('@/assets/content/osteo1/main.json'),
  hanche: require('@/assets/content/osteo1/hanche.json'),
  genou: require('@/assets/content/osteo1/genou.json'),
  cheville: require('@/assets/content/osteo1/cheville.json'),
  pied: require('@/assets/content/osteo1/pied.json'),
};

const osteo2Quiz: Record<string, Quiz> = {
  asthme: require('@/assets/content/osteo2/asthme.json'),
  bpco: require('@/assets/content/osteo2/bpco.json'),
  pneumonie: require('@/assets/content/osteo2/pneumonie.json'),
  embolie: require('@/assets/content/osteo2/embolie.json'),
  cancer: require('@/assets/content/osteo2/cancer.json'),
  hta: require('@/assets/content/osteo2/hta.json'),
  angor: require('@/assets/content/osteo2/angor.json'),
  infarctus: require('@/assets/content/osteo2/infarctus.json'),
  insuffisance: require('@/assets/content/osteo2/insuffisance.json'),
  avc: require('@/assets/content/osteo2/avc.json'),
};

const topicsToQuiz: Record<string, Record<string, Quiz>> = {
  // math: mathQuiz,
  osteo1: osteo1Quiz,
  osteo2: osteo2Quiz,
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
