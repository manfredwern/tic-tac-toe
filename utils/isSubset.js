export const isSubset = (arrayToCheck, referenceArray) =>
  referenceArray.every((element) => arrayToCheck.includes(element));
