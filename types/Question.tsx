export interface Question {
  type?: string;
  title?: string;
  description?: string;
  image?: string;
  choices?: string[];
  answers?: string[];
  id?: string;
}