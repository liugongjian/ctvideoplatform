export const getRectPropFromPoints = (startPoint, endPoint) => {
  const left = startPoint[0];
  const top = startPoint[1];
  const width = endPoint[0] - left;
  const height = endPoint[1] - top;
  return {
    left, top, width, height
  };
};
