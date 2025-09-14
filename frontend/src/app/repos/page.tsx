"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Repo {
    name: string;
    owner: { login: string };
    private: boolean;
    description: string;
}

interface PR {
    number: number;
    title: string;
    author: string;
    head: string;
    base: string;
    headSha: string;
}

interface AIComment {
    file: string;
    line: number;
    severity: string;
    comment: string;
    suggestedFix?: string;
}

interface AIResponse {
    summary: string;
    findings: AIComment[];
}

export default function RepoPage() {
    const [token, setToken] = useState("");
    const [repos, setRepos] = useState<Repo[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
    const [prs, setPRs] = useState<PR[]>([]);
    const [selectedPR, setSelectedPR] = useState<PR | null>(null);
    const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
    const [loading, setLoading] = useState(false);

    // Get token from query string after OAuth redirect
    useEffect(() => {
        const url = new URL(window.location.href);
        const tokenFromQuery = url.searchParams.get("token");
        if (tokenFromQuery) setToken(tokenFromQuery);
    }, []);

    // Fetch user repos
    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch("https://api.github.com/user/repos", {
            headers: { Authorization: `token ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setRepos(data))
            .finally(() => setLoading(false));
    }, [token]);

    // Fetch open PRs for selected repo
    const fetchPRs = async (repo: Repo) => {
        setLoading(true);
        setSelectedRepo(repo);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/fetch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                owner: repo.owner.login,
                repo: repo.name,
            }),
        });
        const prsData: PR[] = await res.json();
        setPRs(prsData);
        setLoading(false);
    };

    // Analyze selected PR
    const analyzePR = async (pr: PR) => {
        if (!selectedRepo) return;
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                owner: selectedRepo.owner.login,
                repo: selectedRepo.name,
                prNumber: pr.number,
            }),
        });
        const aiData: AIResponse = await res.json();
        setSelectedPR(pr);
        setAIResponse(aiData);
        setLoading(false);
    };

    // Send comments automatically using headSha
    const sendComments = async () => {
        if (!aiResponse || !selectedRepo || !selectedPR) return;

        await fetch("/api/pr/send-comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                owner: selectedRepo.owner.login,
                repo: selectedRepo.name,
                prNumber: selectedPR.number,
                headSha: selectedPR.headSha,
                aiResponse,
            }),
        });
        alert("Comments sent to GitHub PR!");
    };

    return (
        <div className="p-4">
            <Header />
            {
                selectedRepo ? "" 
                            : <h1 className="text-2xl font-bold mb-6 mt-6">Select a Repo to Review PRs</h1>
            }
            

            {loading && <p>Loading...</p>}

            {/* Step 1: Select Repo */}
            {!selectedRepo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {repos.map((repo) => (
                        <div
                            key={repo.name}
                            className="border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer"
                            onClick={() => fetchPRs(repo)}
                        >
                            <h2 className="text-xl font-semibold">{repo.name}</h2>
                            <p className="text-gray-600">{repo.description}</p>
                            <p className="text-sm text-gray-400">
                                Owner: {repo.owner.login} | {repo.private ? "Private" : "Public"}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Step 2: Select PR */}
            {selectedRepo && !selectedPR && (
                <div className="mt-6">
                    {
                    prs.length === 0 && !loading ? <h2 className="text-2xl font-bold mb-4">No open PRs found in this repo</h2>
                                     :  <h2 className="text-2xl font-bold mb-4">Select a PR to Analyze</h2>
                    }
                    <div className="space-y-4">
                        {prs.map((pr) => (
                            <div
                                key={pr.number}
                                className="border p-4 rounded-lg shadow hover:bg-gray-50 cursor-pointer"
                                onClick={() => analyzePR(pr)}
                            >
                                <p>
                                    <strong>PR #{pr.number}:</strong> {pr.title}
                                </p>
                                <p>
                                    <strong>Author:</strong> {pr.author} | <strong>Branch:</strong>{" "}
                                    {pr.head} → {pr.base}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Show AI Review */}
            {selectedPR && aiResponse && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">AI Review for PR #{selectedPR.number}</h2>
                    <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">{aiResponse.summary}</div>

                    <h3 className="text-xl font-semibold mb-2">File Findings</h3>
                    <div className="space-y-4">
                        {aiResponse.findings.map((f, idx) => (
                            <div
                                key={idx}
                                className="border-l-4 p-4 rounded shadow hover:bg-gray-50 transition"
                            >
                                <p>
                                    <strong>File:</strong> {f.file} | <strong>Line:</strong> {f.line} |{" "}
                                    <strong>Severity:</strong> {f.severity}
                                </p>
                                <p>
                                    <strong>Comment:</strong> {f.comment}
                                </p>
                                {f.suggestedFix && (
                                    <p className="text-blue-600">
                                        <strong>Suggested Fix:</strong> {f.suggestedFix}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={sendComments}
                        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                        Send Comments to your Repo
                    </button>
                </div>
            )}
            {/* <Footer /> */}
        </div>
    );
}
















// "use client";

// import { useEffect, useState } from "react";

// interface Repo {
//   name: string;
//   owner: { login: string };
//   private: boolean;
//   description: string;
// }

// interface PR {
//   number: number;
//   title: string;
//   author: string;
//   head: string;
//   base: string;
// }

// interface AIComment {
//   file: string;
//   line: number;
//   severity: string;
//   comment: string;
//   suggestedFix?: string;
// }

// interface AIResponse {
//   summary: string;
//   findings: AIComment[];
// }

// export default function RepoPage() {
//   const [token, setToken] = useState("");
//   const [repos, setRepos] = useState<Repo[]>([]);
//   const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
//   const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Get token from query string after OAuth redirect
//   useEffect(() => {
//     const url = new URL(window.location.href);
//     const tokenFromQuery = url.searchParams.get("token");
//     if (tokenFromQuery) setToken(tokenFromQuery);
//   }, []);

//   // Fetch user repos
//   useEffect(() => {
//     if (!token) return;
//     setLoading(true);
//     fetch("https://api.github.com/user/repos", {
//       headers: { Authorization: `token ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => setRepos(data))
//       .finally(() => setLoading(false));
//   }, [token]);

//   // Analyze PR for selected repo (simplified: pick first open PR)
//   const analyzePR = async (repo: Repo) => {
//     setLoading(true);
//     // Fetch open PRs from your backend /pr/fetch
//     const prResponse = await fetch("/api/pr/fetch", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         token,
//         owner: repo.owner.login,
//         repo: repo.name,
//       }),
//     });
//     const prs: PR[] = await prResponse.json();
//     if (!prs.length) {
//       alert("No open PRs in this repo.");
//       setLoading(false);
//       return;
//     }
//     const prNumber = prs[0].number;

//     // Call /pr/analyze
//     const aiRes = await fetch("/api/pr/analyze", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         token,
//         owner: repo.owner.login,
//         repo: repo.name,
//         prNumber,
//       }),
//     });
//     const aiData: AIResponse = await aiRes.json();
//     setAIResponse(aiData);
//     setSelectedRepo(repo);
//     setLoading(false);
//   };

//   // Send comments
//   const sendComments = async () => {
//     if (!aiResponse || !selectedRepo) return;
//     const headSha = prompt("Enter PR head SHA to send comments:"); // you can fetch this from backend if needed
//     if (!headSha) return;

//     await fetch("/api/pr/send-comments", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         token,
//         owner: selectedRepo.owner.login,
//         repo: selectedRepo.name,
//         prNumber: 1, // simplify: first PR for now
//         headSha,
//         aiResponse,
//       }),
//     });
//     alert("Comments sent to GitHub PR!");
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Select a Repo to Review PRs</h1>

//       {loading && <p>Loading...</p>}

//       {!selectedRepo && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {repos.map((repo) => (
//             <div
//               key={repo.name}
//               className="border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer"
//               onClick={() => analyzePR(repo)}
//             >
//               <h2 className="text-xl font-semibold">{repo.name}</h2>
//               <p className="text-gray-600">{repo.description}</p>
//               <p className="text-sm text-gray-400">
//                 Owner: {repo.owner.login} | {repo.private ? "Private" : "Public"}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {selectedRepo && aiResponse && (
//         <div className="mt-6">
//           <h2 className="text-2xl font-bold mb-4">AI Review Summary</h2>
//           <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">{aiResponse.summary}</div>

//           <h3 className="text-xl font-semibold mb-2">File Findings</h3>
//           <div className="space-y-4">
//             {aiResponse.findings.map((f, idx) => (
//               <div
//                 key={idx}
//                 className="border-l-4 p-4 rounded shadow hover:bg-gray-50 transition"
//               >
//                 <p>
//                   <strong>File:</strong> {f.file} | <strong>Line:</strong> {f.line} |{" "}
//                   <strong>Severity:</strong> {f.severity}
//                 </p>
//                 <p>
//                   <strong>Comment:</strong> {f.comment}
//                 </p>
//                 {f.suggestedFix && (
//                   <p className="text-blue-600">
//                     <strong>Suggested Fix:</strong> {f.suggestedFix}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={sendComments}
//             className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
//           >
//             Send Comments to GitHub
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
