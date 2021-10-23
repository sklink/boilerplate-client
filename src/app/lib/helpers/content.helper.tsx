export const pluralTerm = (term: string) => {
  return term.charAt(term.length - 1) === 's' ? `${term}'` : `${term}s`;
};
