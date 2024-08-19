export const getAbsUrl = url => {
  const dummyLink = document.createElement('a');
  dummyLink.href = url;
  return dummyLink.href;
};
