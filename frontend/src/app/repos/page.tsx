"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";


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
     const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [dots, setDots] = useState(".");
    const [token, setToken] = useState("");
    const [repos, setRepos] = useState<Repo[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
    const [prs, setPRs] = useState<PR[]>([]);
    const [selectedPR, setSelectedPR] = useState<PR | null>(null);
    const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Animated dots effect
    useEffect(() => {
        if (!isAnalyzing) return;
        const interval = setInterval(() => {
        setDots((prev) => (prev.length === 3 ? "." : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, [isAnalyzing]);


    // Get token from query string after OAuth redirect
    useEffect(() => {
        const url = new URL(window.location.href);
        const tokenFromQuery = url.searchParams.get("token");
        if (tokenFromQuery) {
          setToken(tokenFromQuery);
        }
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
        
        fetchAndStoreGitHubUserData(token);
    }, [token]);


    async function fetchAndStoreGitHubUserData(token: string) {
      try {
        const res = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
        });

        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status}`);
        }

        const data = await res.json();
        const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!backendRes.ok) {
          throw new Error(`Backend error: ${backendRes.status}`);
        }
      } catch (err) {
        console.error("❌ Error fetching/storing GitHub user data:", err);
      }
    }


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
        setIsAnalyzing(true);
        console.log("Token: ", token);
        console.log("Ai Response: ", aiResponse);
        console.log("selected Repo: ", selectedRepo);
        console.log("Selected PR: ",selectedPR);
        console.log(selectedPR?.headSha);
        if (!aiResponse || !selectedRepo || !selectedPR) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pr/send-comments`, {
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
        } catch (err) {
            console.error("❌ Error sending comments");
        } finally {
      setIsAnalyzing(false);
      setDots(".");
    }
};

    return (
       <div className="flex flex-col min-h-screen">
  {/* Header + Content */}
  <div className="flex-grow p-4">
    <Header />
    {
      selectedRepo 
                    ? "" 
                    : <div className="flex flex-col items-center justify-center mt-6"> 
                       <h1 className="text-4xl font-bold mb-6 mt-6">Select a Repo to Review PRs</h1>
                        {loading && <div className="loader"></div>}
                     </div>
    }

    

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
        {prs.length === 0 && !loading 
          ? <div className="flex flex-col items-center justify-center mb-4"> 
                <h2 className="text-4xl font-bold mb-4">No open PRs found in this repo</h2> 
            </div>
          : <div className="flex flex-col items-center justify-center mb-4">
                <h2 className="text-4xl font-bold mb-4">Select a PR to Analyze</h2>
                {loading && <div className="loader"></div>}
            </div>
        }
        <div className="space-y-4">
          {prs.map((pr) => (
            <div
              key={pr.number}
              className="border p-4 rounded-lg shadow hover:bg-gray-90 cursor-pointer"
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
      <div className="mt-6 p-4">
        <h2 className="text-3xl font-bold mb-4">AI Review for PR #{selectedPR.number}</h2>
        <div className="bg-gray-20 p-4 rounded-lg shadow mb-6">{aiResponse.summary}</div>

        <h3 className="text-2xl font-semibold mb-2">Findings :-</h3>
        <div className="space-y-4">
          {aiResponse.findings.map((f, idx) => (
            <div
              key={idx}
              className="border-l-4 p-4 rounded shadow hover:bg-gray-20 transition"
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
        <div className="flex justify-center">
          <button
            onClick={sendComments}
            disabled={isAnalyzing}
            className={`mt-6 font-bold px-6 py-3 rounded-lg transition ${
              isAnalyzing
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-gray-100 text-black hover:bg-gray-300 cursor-pointer"
            }`}
          >
            {isAnalyzing ? "Commenting in Repo..." : "Send Comments to your Repo"}
          </button>
        </div>
      </div>
    )}
  </div>
  <Footer />
</div>

    );
}