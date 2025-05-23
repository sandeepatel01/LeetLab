import { Role } from "../generated/prisma/index.js";
import { db } from "../libs/database.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProblem = async (req, res) => {
      const { title, description, difficulty, tags, examples, constraints, hints, editorial, testcases, codeSnippets, referenceSolutions } = req.body;

      if ([title, description, difficulty, tags, examples, constraints, hints, editorial, testcases, codeSnippets, referenceSolutions].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
      };

      if (req.user.role !== Role.ADMIN) {
            throw new ApiError(403, "You are not authorized to create a problem");
      };

      try {
            for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
                  const languageId = await getJudge0LanguageId(language);

                  if (!languageId) {
                        throw new ApiError(400, `Language ${language} is not supported`);
                  };

                  const submissions = testcases.map(({ input, output }) => ({
                        source_code: solutionCode,
                        language_id: languageId,
                        stdin: input,
                        expected_output: output
                  }));

                  const submissionResults = await submitBatch(submissions);
                  const tokens = submissionResults.map((result) => result.token);

                  const results = await pollBatchResults(tokens);

                  for (let i = 0; i < results.length; i++) {
                        const result = results[i];

                        if (result.status.id !== 3) {
                              throw new ApiError(400, `Testcase ${i + 1} failed for language ${language}`);
                        }
                  }

                  const newProblem = await db.problem.create({
                        data: {
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
                              userId: req.user.id
                        }
                  });

                  res.status(201).json(
                        new ApiResponse(
                              201,
                              newProblem,
                              "Problem created successfully"
                        )
                  )
            }
      } catch (error) {
            throw new ApiError(500, error?.message || "Error creating problem");
      }
};

const getAllProblems = async (req, res) => {

};

const getProblemById = async (req, res) => {

};

const updateProblem = async (req, res) => {

};

const deleteProblem = async (req, res) => {

};

const getAllProblemsSolvedByUser = async (req, res) => {

};

export {
      createProblem,
      getAllProblems,
      getProblemById,
      updateProblem,
      deleteProblem,
      getAllProblemsSolvedByUser
}
