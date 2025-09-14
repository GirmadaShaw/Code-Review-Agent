export const extractLinkedIssues = (prBody: string): number[] => {
  const regex = /Fixes\s+#(\d+)/gi;
  const matches = [];
  let match;
  while ((match = regex.exec(prBody)) !== null) {
    matches.push(Number(match[1]));
  }
  return matches;
};
