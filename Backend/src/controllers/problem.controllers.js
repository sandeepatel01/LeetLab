import { Role } from "../generated/prisma/index.js";
import db from "../libs/database.js";
import { ApiError } from "../utils/ApiError.js";

const createProblem = async (req, res) => {
      const { title, description, difficulty, tags, examples, constraints, hints, editorial, testcases, codeSnippets, referenceSolutions } = req.body;

      if ([title, description, difficulty, tags, examples, constraints, hints, editorial, testcases, codeSnippets, referenceSolutions].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
      };

      if (req.user.role !== Role.ADMIN) {
            throw new ApiError(403, "You are not authorized to create a problem");
      };

      try {

      } catch (error) {

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
