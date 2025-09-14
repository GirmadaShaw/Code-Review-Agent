import { Octokit } from "@octokit/rest";
import { extractLinkedIssues } from "../utils/parseIssues.js";

export const getOpenPRs = async (token: string, owner: string, repo: string) => {
  const octokit = new Octokit({ auth: token });
  const prs = await octokit.pulls.list({ owner, repo, state: "open" });

//   console.log("getOpenPRs invoked in GITHUB SERVICES: ", prs );

  return prs.data.map(pr => ({
    number: pr.number,
    title: pr.title,
    author: pr.user?.login,
    head: pr.head.ref,
    base: pr.base.ref,
    headSha: pr.head.sha
  }));
};

export const getPRFiles = async (token: string, owner: string, repo: string, prNumber: number) => {
  const octokit = new Octokit({ auth: token });
  const files = await octokit.pulls.listFiles({ owner, repo, pull_number: prNumber });

//   console.log("getPRFiles invoked in github services: ", files );


  return files.data.map(f => ({
    filename: f.filename,
    patch: f.patch || "",
  }));
};

export const getLinkedIssues = async (token: string, owner: string, repo: string, prNumber: number) => {
  const octokit = new Octokit({ auth: token });
  // Fetch PR body
  const pr = await octokit.pulls.get({ owner, repo, pull_number: prNumber });
  const issueNumbers = extractLinkedIssues(pr.data.body || "");

  const issues = [];
  for (const num of issueNumbers) {
    const issue = await octokit.issues.get({ owner, repo, issue_number: num });
    issues.push({
      issueNumber: num,
      title: issue.data.title,
      body: issue.data.body,
    });
  }
//   console.log("getLinkedIssues invoked in github services: ", issues);
  return issues;
};


export const postInlineComment = async (
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  commit_id: string,
  path: string,
  line: number,
  body: string
) => {
  const octokit = new Octokit({ auth: token });

  await octokit.pulls.createReviewComment({
    owner,
    repo,
    pull_number: prNumber,
    commit_id,
    path,
    line,
    body,
  });
};

