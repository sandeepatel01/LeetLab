import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  MemoryStick,
} from "lucide-react";

const RunResults = ({ results, isCustomRun }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-4 text-base-content/70">
        No results to display
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">
        {isCustomRun ? "Custom Test Result" : "Test Results"}
      </h3>

      {results.map((result, index) => (
        <div
          key={index}
          className={`card ${result.passed ? "bg-success/10" : "bg-error/10"}`}
        >
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.passed ? (
                  <CheckCircle2 className="text-success w-5 h-5" />
                ) : (
                  <XCircle className="text-error w-5 h-5" />
                )}
                <span className="font-bold">
                  {isCustomRun ? "Custom Test" : `Test Case ${index + 1}`}
                </span>
              </div>
              <span className="text-sm">{result.status || "Completed"}</span>
            </div>

            {!isCustomRun && (
              <div className="mt-2">
                <div className="text-sm font-semibold">Input</div>
                <pre className="bg-base-200 p-2 rounded text-sm overflow-x-auto">
                  {result.input}
                </pre>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <div className="text-sm font-semibold">
                  {isCustomRun ? "Your Output" : "Expected"}
                </div>
                <pre className="bg-base-200 p-2 rounded text-sm overflow-x-auto">
                  {isCustomRun ? result.output : result.expected}
                </pre>
              </div>
              {!isCustomRun && (
                <div>
                  <div className="text-sm font-semibold">Your Output</div>
                  <pre className="bg-base-200 p-2 rounded text-sm overflow-x-auto">
                    {result.output || "No output"}
                  </pre>
                </div>
              )}
            </div>

            {(result.stderr || result.compileOutput) && (
              <div className="mt-3">
                <div className="flex items-center gap-2 text-warning">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold">
                    {result.stderr ? "Runtime Error" : "Compilation Message"}
                  </span>
                </div>
                <pre className="bg-warning/10 p-2 rounded text-sm overflow-x-auto">
                  {result.stderr || result.compileOutput}
                </pre>
              </div>
            )}

            <div className="flex gap-4 mt-3 text-sm">
              {result.time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{result.time}</span>
                </div>
              )}
              {result.memory && (
                <div className="flex items-center gap-1">
                  <MemoryStick className="w-4 h-4" />
                  <span>{result.memory}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RunResults;
