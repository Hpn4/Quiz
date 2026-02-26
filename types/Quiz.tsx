import { Question } from "@/types/Question";

export interface Quiz {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  questions?: Question[];
  glossary?: { term: string; definition: string }[];
  infoTable?: { key: string; value: string }[];
}