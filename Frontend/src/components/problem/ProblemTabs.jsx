import { FileText, MessageSquare, Lightbulb, Code2 } from "lucide-react";
import SubmissionsList from "./SubmissionsList";

const ProblemTabs = ({
  activeTab,
  setActiveTab,
  problem,
  submissions,
  isSubmissionsLoading,
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>
            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(([lang, example]) => (
                  <div
                    key={lang}
                    className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                  >
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 font-semibold">
                        Input:
                      </div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg text-white">
                        {example.input}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 font-semibold">
                        Output:
                      </div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg text-white">
                        {example.output}
                      </span>
                    </div>
                    {example.explanation && (
                      <div>
                        <div className="text-emerald-300 mb-2 font-semibold">
                          Explanation:
                        </div>
                        <p className="text-base-content/70 text-lg">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <span className="bg-black/90 px-4 py-1 rounded-lg text-white text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );
      case "hints":
        return problem.hints ? (
          <div className="p-4 bg-base-200 rounded-xl">
            <span className="bg-black/90 px-4 py-1 rounded-lg text-white text-lg">
              {problem.hints}
            </span>
          </div>
        ) : (
          <div className="p-4 text-center text-base-content/70">
            No hints available
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-0">
        <div className="tabs tabs-bordered">
          <button
            className={`tab gap-2 ${
              activeTab === "description" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("description")}
          >
            <FileText className="w-4 h-4" />
            Description
          </button>
          <button
            className={`tab gap-2 ${
              activeTab === "submissions" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("submissions")}
          >
            <Code2 className="w-4 h-4" />
            Submissions
          </button>
          <button
            className={`tab gap-2 ${
              activeTab === "discussion" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("discussion")}
          >
            <MessageSquare className="w-4 h-4" />
            Discussion
          </button>
          <button
            className={`tab gap-2 ${activeTab === "hints" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("hints")}
          >
            <Lightbulb className="w-4 h-4" />
            Hints
          </button>
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProblemTabs;
