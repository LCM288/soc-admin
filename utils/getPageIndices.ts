const getPageIndices = (currentPage: number, pageCount: number): number[] => {
  if (pageCount <= 0) {
    return [];
  }
  const len = Math.ceil(Math.log(pageCount));
  const diff = Array(len)
    .fill(0)
    .map((_, idx) => 2 ** (idx + 1) - 1);

  return [
    ...diff.map((d) => currentPage - d),
    currentPage,
    ...diff.map((d) => currentPage + d),
  ]
    .filter((x) => x > 0 && x < pageCount - 1)
    .concat(pageCount === 1 ? [0] : [0, pageCount - 1])
    .sort((a, b) => a - b);
};

export default getPageIndices;
