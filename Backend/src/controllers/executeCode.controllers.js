import { pollBatchResults, submitBatch } from "../libs/judge0.js";
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

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Code executed successfully",
                        results
                  )
            )
      } catch (error) {

      }
};

export {
      executeCode
}