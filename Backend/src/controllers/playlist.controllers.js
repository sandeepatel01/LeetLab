import { db } from "../libs/database.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPlaylist = async (req, res) => {
      try {
            const { title, description, banner } = req.body
            const userId = req.user.id;

            const playlist = await db.playlist.create({
                  data: {
                        title,
                        description,
                        banner,
                        userId
                  }
            });

            if (!playlist) {
                  throw new ApiError(500, "Playlist not created");
            };

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Playlist created successfully",
                        playlist
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error creating playlist");
      }
};

const getAllListDetails = async (req, res) => {
      try {
            const playlists = await db.playlist.findMany({
                  where: {
                        userId: req.user.id
                  },
                  include: {
                        problems: {
                              include: {
                                    problem: true
                              }
                        }
                  }
            });

            if (!playlists) {
                  throw new ApiError(404, "No playlist found");
            };

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Playlist fetched successfully",
                        playlists
                  )
            )

      } catch (error) {
            throw new ApiError(500, error?.message || "Error fetching playlist");
      }
};

const getPlayListDetails = async (req, res) => {
      try {
            const { playlistId } = req.params;

            if (!playlistId) {
                  throw new ApiError(400, "Credential not found");
            };

            const playlist = await db.playlist.findUnique({
                  where: {
                        id: playlistId,
                        userId: req.user.id
                  },
                  include: {
                        problems: {
                              include: {
                                    problem: true
                              }
                        }
                  }
            });

            if (!playlist) {
                  throw new ApiError(404, "Playlist not found");
            };

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Playlist fetched successfully",
                        playlist
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error fetching playlist");
      }
};

const addProblemToPlaylist = async (req, res) => {
      try {
            const { playlistId } = req.params;
            const { problemIds } = req.body;

            if (!Array.isArray(problemIds) || problemIds.length === 0) {
                  throw new ApiError(400, "Invalid or missing problemIds");
            };

            const problemsInPlaylist = await db.problemsInPlaylist.createMany({
                  data: problemIds.map((problemId) => ({
                        playlistId,
                        problemId
                  }))
            });

            if (!problemsInPlaylist) {
                  throw new ApiError(500, "Error adding problem to playlist");
            };

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Problem added to playlist successfully",
                        problemsInPlaylist
                  )
            )

      } catch (error) {
            throw new ApiError(500, error?.message || "Error adding problem to playlist");
      }
};

const removeProblemFromPlaylist = async (req, res) => {
      try {
            const { playlistId } = req.params;
            const { problemIds } = req.body;

            if (!Array.isArray(problemIds) || problemIds.length === 0) {
                  throw new ApiError(400, "Invalid or missing problemIds");
            };

            const removedProblems = await db.problemsInPlaylist.deleteMany({
                  where: {
                        playlistId,
                        problemId: {
                              in: problemIds
                        }
                  }
            });

            if (!removedProblems) {
                  throw new ApiError(500, "Error removing problem from playlist");
            };

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Problem removed from playlist successfully",
                        removedProblems
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error removing problem from playlist");
      }
};

const deletePlaylist = async (req, res) => {
      try {
            const { playlistId } = req.params;

            if (!playlistId) {
                  throw new ApiError(400, "Credential not found");
            };

            const deletedPlaylist = await db.playlist.delete({
                  where: {
                        id: playlistId,
                  }
            });

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Playlist deleted successfully",
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error deleting playlist");
      }
};

export {
      createPlaylist,
      getAllListDetails,
      getPlayListDetails,
      addProblemToPlaylist,
      removeProblemFromPlaylist,
      deletePlaylist
}