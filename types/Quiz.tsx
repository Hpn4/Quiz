import { Question } from "@/types/Question";

interface Quiz {
  name: string;
  slug: string;
  description: string;
  image: string;
  questions: Question[];
}

export default Quiz;