import Submission from "./Submission";

const TestCaseSection = ({ testcases, submission }) => {
  return (
    <div className="card bg-base-100 shadow-xl mt-6">
      <div className="card-body">
        {submission ? (
          <Submission submission={submission} />
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
  );
};

export default TestCaseSection;
