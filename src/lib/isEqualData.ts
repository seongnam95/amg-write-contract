export const isEqualData = <T = any>(a: T, b: T): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};
