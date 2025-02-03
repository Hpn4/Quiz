const topics = {
  "math": require('@/assets/content/math/index.json'),
};

const mathQuiz = {
  "groupe": require('@/assets/content/math/groupe.json'),
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
  console.log(topic_slug);
  return Object.values(topicsToQuiz[topic_slug]);
}

export function getQuiz(topic_slug: string, quiz_slug: string) : Quiz
{
  console.log(topic_slug, quiz_slug);
  return topicsToQuiz[topic_slug][quiz_slug];
}