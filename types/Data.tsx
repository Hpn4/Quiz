const topics = {
  "math": require('@/assets/content/math/index.json'),
};

const mathQuiz = {
  "groupe": require('@/assets/content/math/groupe.json'),
  "proba": require('@/assets/content/math/proba.json'),
};

const topicsToQuiz = {
  "math": mathQuiz,
};

export function getTopics() : Topic[]
{
  return Object.values(topics);
}

export function getTopic(slug: string) : Topic
{
  return topics[slug];
}

export function getQuizs(topic_slug: string) : Quiz[]
{
  return Object.values(topicsToQuiz[topic_slug]);
}

export function getQuiz(topic_slug: string, quiz_slug: string) : Quiz
{
  return topicsToQuiz[topic_slug][quiz_slug];
}