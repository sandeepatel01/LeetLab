import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { useExecutionStore } from "../store/useExecutionStore";
import ProblemNavbar from "../components/problem/ProblemNavbar";
import ProblemTabs from "../components/problem/ProblemTabs";
import CodeEditor from "../components/problem/CodeEditor";
import { getLanguageId } from "../lib/language";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/problem/Submission";

const ProblemPage = () => {
  const { id } = useParams();

  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);

  const { executeCode, submission, isExecuting, submissionTimestamp } =
    useExecutionStore();

  // Fetch problem & submission count
  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id, getProblemById, getSubmissionCountForProblem]);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  // Fetch submissions only when tab is submissions
  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id, getSubmissionForProblem]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 max-w-7xl w-full">
      <ProblemNavbar
        title={problem.title}
        createdAt={problem.createdAt}
        submissionCount={submissionCount}
        isBookmarked={isBookmarked}
        toggleBookmark={() => setIsBookmarked(!isBookmarked)}
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
        codeSnippets={problem.codeSnippets}
      />

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProblemTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            problem={problem}
            submissions={submissions}
            isSubmissionsLoading={isSubmissionsLoading}
          />

          <CodeEditor
            code={code}
            setCode={setCode}
            selectedLanguage={selectedLanguage}
            isExecuting={isExecuting}
            onRunCode={handleRunCode}
          />
        </div>

        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            {submission ? (
              <Submission key={submissionTimestamp} submission={submission} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Test Cases</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Input</th>
                        <th>Expected Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testcases.map((testCase, index) => (
                        <tr key={index}>
                          <td className="font-mono">{testCase.input}</td>
                          <td className="font-mono">{testCase.output}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
