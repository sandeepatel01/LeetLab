import { Role } from "../../models/user.model.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../../libs/judge0.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createProblem as createProblemService } from "../../services/problem.service.js";

/**
 * Create a new coding problem
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const createProblem = async (req, res) => {
  // Validate admin role
  if (req.user.role !== Role.ADMIN) {
    throw new ApiError(403, "Only admin can create problems");
  }

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippets,
    referenceSolutions
  } = req.body;

  try {
    // Validate all reference solutions with Judge0
    await validateReferenceSolutions(referenceSolutions, testcases);

    // Create problem in database
    const newProblem = await createProblemService({
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referenceSolutions,
      userId: req.user._id
    });

    // Return success response
    res.status(201).json(
      new ApiResponse(201, "Problem created successfully", newProblem)
    );
    
  } catch (error) {
    // Handle specific error cases
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error?.message || "Problem creation failed");
  }
};

/**
 * Validate reference solutions against test cases using Judge0
 * @param {Object} referenceSolutions - Key-value pairs of language to code
 * @param {Array} testcases - Array of test cases
 * @throws {ApiError} If any solution fails test cases
 */
async function validateReferenceSolutions(referenceSolutions, testcases) {
  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageId(language);

    if (!languageId) {
      throw new ApiError(400, `${language} is not supported`);
    }

    // Prepare submissions for all test cases
    const submissions = testcases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expected_output: output
    }));

    // Submit to Judge0 and get tokens
    const submissionResults = await submitBatch(submissions);
    const tokens = submissionResults.map((result) => result.token);

    // Poll for results
    const results = await pollBatchResults(tokens);

    // Check all results
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status.id !== 3) { // 3 means accepted
        const errorDetails = {
          language,
          testcase: i + 1,
          status: result.status.description,
          error: result.stderr || result.compile_output
        };
        console.error("Solution validation failed:", errorDetails);
        throw new ApiError(400, `Testcase ${i + 1} failed for ${language}`);
      }
    }
  }
}

export default createProblem;