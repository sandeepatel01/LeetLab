import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

export const healthcheck = (req, res) => {
      try {
            res.status(200).json(
                  new ApiResponse(
                        200,
                        {
                              message: "Server is running"
                        }
                  )
            )
      } catch (error) {
            res.status(500).json(
                  new ApiError(
                        500,
                        {
                              message: error.message
                        }
                  )
            )
      }
}