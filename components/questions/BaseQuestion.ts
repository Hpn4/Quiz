import { Question } from "@/types/Question";

export function updateSingleSelectionValidity(
  choices: string[],
  nextSelected: number | null,
  question: Question | undefined,
  setValid: (index: number, isValid: boolean) => void,
) {
  choices.forEach((choice, i) => {
    const expected = !!question?.answers?.some(a => a == choice);
    const isChecked = nextSelected === i;
    setValid(i, isChecked === expected);
  });
}

export default updateSingleSelectionValidity;

export function updateMultiSelectionValidity(
  choices: string[],
  nextSelected: number[],
  question: Question | undefined,
  setValid: (index: number, isValid: boolean) => void,
) {
  const selectedSet = new Set(nextSelected);
  choices.forEach((choice, i) => {
    const expected = !!question?.answers?.some(a => a == choice);
    const isChecked = selectedSet.has(i);
    setValid(i, isChecked === expected);
  });
}
