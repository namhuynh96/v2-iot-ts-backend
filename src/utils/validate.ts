const isAwsIotPattern = (value: string) => {
  const awsIotPattern = /^[a-zA-Z\d-_:]+$/;
  if (!awsIotPattern.test(value)) {
    return false;
  }
  return true;
};

const isDuplicatedElements = <T>(array: T[]) => {
  const firsDuplicatedElement = array.find((e, index) => {
    const rightRest = array.slice(index + 1);
    if (rightRest.length > 0) {
      return rightRest.includes(e);
    }
  });

  if (firsDuplicatedElement) return true;
  return false;
};

export { isAwsIotPattern, isDuplicatedElements };