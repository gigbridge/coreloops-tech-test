export type Override<T, R> = Omit<T, keyof R> & R;

export type WithClause = {
  abilities: any;
  types: any;
  moves?: any;
};
