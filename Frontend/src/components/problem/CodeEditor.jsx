import Editor from "@monaco-editor/react";
import { Terminal, Play } from "lucide-react";

const CodeEditor = ({
  code,
  setCode,
  selectedLanguage,
  isExecuting,
  onRunCode,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-0">
        <div className="tabs tabs-bordered">
          <button className="tab tab-active gap-2">
            <Terminal className="w-4 h-4" />
            Code Editor
          </button>
        </div>
        <div className="h-[600px] w-full">
          <Editor
            height="100%"
            language={selectedLanguage.toLowerCase()}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 20,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="p-4 border-t border-base-300 bg-base-200">
          <div className="flex justify-between items-center">
            <button
              className={`btn btn-primary gap-2 ${
                isExecuting ? "loading" : ""
              }`}
              onClick={onRunCode}
              disabled={isExecuting}
            >
              {!isExecuting && <Play className="w-4 h-4" />}
              Run Code
            </button>
            <button className="btn btn-success gap-2">Submit Solution</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
