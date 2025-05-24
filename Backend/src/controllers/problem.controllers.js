import { Role } from "../generated/prisma/index.js";
import { db } from "../libs/database.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProblem = async (req, res) => {
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
      console.log("Body Data: ", req.body);

      if (req.user.role !== Role.ADMIN) {
            throw new ApiError(403, "You are not authorized to create a problem");
      };

      try {
            for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
                  const languageId = getJudge0LanguageId(language);

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
                        console.log("Result: ", results);

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
                  console.log("New Problem: ", newProblem);

                  res.status(201).json(
                        new ApiResponse(
                              201,
                              "Problem created successfully",
                              newProblem
                        )
                  )
            }
      } catch (error) {
            throw new ApiError(500, error?.message || "Error creating problem");
      }
};

const getAllProblems = async (req, res) => {
      try {
            const problems = await db.problem.findMany();
            if (!problems) {
                  throw new ApiError(404, "No problems found");
            };

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Problems fetched successfully",
                        problems
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error fetching problems");
      }
};

const getProblemById = async (req, res) => {
      const { id } = req.params;

      try {
            const problem = await db.problem.findUnique({
                  where: {
                        id: id
                  }
            });

            if (!problem) {
                  throw new ApiError(404, "Problem not found");
            };

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Problem fetched successfully",
                        problem
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error fetching problem");
      }
};

const updateProblem = async (req, res) => {
      const { id } = req.params;
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

      if (req.user.role !== Role.ADMIN) {
            throw new ApiError(403, "You are not authorized to update a problem");
      }

      try {
            const existingProblem = await db.problem.findUnique({ where: { id } });

            if (!existingProblem) {
                  throw new ApiError(404, "Problem not found");
            }

            // If referenceSolutions are being updated, validate them
            if (referenceSolutions) {
                  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
                        const languageId = getJudge0LanguageId(language);

                        if (!languageId) {
                              throw new ApiError(400, `Language ${language} is not supported`);
                        }

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
                  }
            }

            const updatedProblem = await db.problem.update({
                  where: { id },
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
                        referenceSolutions
                  }
            });

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Problem updated successfully",
                        updatedProblem
                  )
            );

      } catch (error) {
            throw new ApiError(500, error?.message || "Error updating problem");
      }
};

const deleteProblem = async (req, res) => {
      const { id } = req.params;

      if (req.user.role !== Role.ADMIN) {
            throw new ApiError(403, "You are not authorized to delete a problem");
      }

      try {
            const problem = await db.problem.findUnique({ where: { id } });

            if (!problem) {
                  throw new ApiError(404, "Problem not found");
            }

            await db.problem.delete({ where: { id } });

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Problem deleted successfully",
                  )
            );
      } catch (error) {
            throw new ApiError(500, error?.message || "Error deleting problem");
      }
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
