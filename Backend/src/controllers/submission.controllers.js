import { db } from "../libs/database.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllSubmission = async (req, res) => {
      try {
            const userId = req.user.id;

            if (!userId) {
                  throw new ApiError(400, "User not found");
            }

            const submissions = await db.submission.findMany({
                  where: {
                        userId: userId
                  }
            });

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Submissions fetched successfully",
                        submissions
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error fetching submissions");
      }
};

const getSubmissionsForProblem = async (req, res) => {

};

const getAllTheSubmissionsForProblem = async (req, res) => {

};

export {
      getAllSubmission,
      getSubmissionsForProblem,
      getAllTheSubmissionsForProblem
}