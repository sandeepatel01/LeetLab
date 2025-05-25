import { db } from "../libs/database.js";
import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const executeCode = async (req, res) => {
      const {
            source_code,
            language_id,
            stdin,
            expected_outputs,
            problemId,
      } = req.body;

      const userId = req.user.id;
      try {
            if (
                  !Array.isArray(stdin) ||
                  stdin.length === 0 ||
                  !Array.isArray(expected_outputs) ||
                  expected_outputs.length !== stdin.length
            ) {
                  throw new ApiError(400, "Invalid or missing test cases");
            };

            const submissions = stdin.map((input) => ({
                  source_code,
                  language_id,
                  stdin: input
            }));

            const submitResponse = await submitBatch(submissions);
            const tokens = submitResponse.map((submission) => submission.token);

            const results = await pollBatchResults(tokens);

            console.log("Result-------");
            console.log(results);

            let allPassed = true;
            const detailedResults = results.map((result, index) => {
                  const stdout = result.stdout?.trim();
                  const expected_output = expected_outputs[index]?.trim();
                  const passed = stdout === expected_output;

                  if (!passed) {
                        allPassed = false;
                  };

                  return {
                        testCase: index + 1,
                        passed,
                        stdout,
                        expected: expected_output,
                        stdrr: result.stderr || null,
                        compile_output: result.compile_output || null,
                        status: result.status.description,
                        memory: result.memory ? `${result.memory} KB` : undefined,
                        time: result.time ? `${result.time} sec` : undefined
                  };

                  // console.log(`Testcase ${index + 1}`);
                  // console.log(`Input for testcase ${index + 1}: ${stdin[index]}`);
                  // console.log(`Expected Output for testcase ${index + 1}: ${expected_output}`);
                  // console.log(`Actual Output for testcase ${index + 1}: ${stdout}`);
                  // console.log(`Passed testcase ${index + 1}: ${passed}`);
            });

            console.log("Detailed Result-------");
            console.log(detailedResults);

            const submission = await db.submission.create({
                  data: {
                        userId,
                        problemId,
                        code: source_code,
                        language: getLanguageName(language_id),
                        stdin: stdin.join("\n"),
                        stdout: JSON.stringify(detailedResults.map((result) => result.stdout)),
                        stderr: detailedResults.some((result) => result.stderr) ? JSON.stringify(detailedResults.map((result) => result.stderr)) : null,
                        compileOutput: detailedResults.some((result) => result.compile_output) ? JSON.stringify(detailedResults.map((result) => result.compile_output)) : null,
                        status: allPassed ? "Accepted" : "Wrong Answer",
                        memory: detailedResults.some((result) => result.memory) ? JSON.stringify(detailedResults.map((result) => result.memory)) : null,
                        time: detailedResults.some((result) => result.time) ? JSON.stringify(detailedResults.map((result) => result.time)) : null,
                  }
            });

            if (allPassed) {
                  await db.problemSolved.upsert({
                        where: {
                              userId_problemId: {
                                    userId,
                                    problemId
                              }
                        },
                        update: {},
                        create: {
                              userId,
                              problemId
                        }
                  })
            };

            const testCaseResults = detailedResults.map((result) => ({
                  submissionId: submission.id,
                  testCase: result.testCase,
                  passed: result.passed,
                  stdout: result.stdout,
                  stderr: result.stderr,
                  expected: result.expected,
                  compileOutput: result.compile_output,
                  status: result.status,
                  memory: result.memory,
                  time: result.time
            }));

            await db.testCaseResult.createMany({
                  data: testCaseResults
            });

            const submissionWithTestCase = await db.submission.findUnique({
                  where: {
                        id: submission.id
                  },
                  include: {
                        testcases: true
                  }
            });

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Code executed successfully",
                        { submission: submissionWithTestCase }
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error executing code");
      }
};

export {
      executeCode
}