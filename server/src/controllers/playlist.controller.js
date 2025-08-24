import {db} from "../lib/db.js";
import {ApiError} from "../utils/api-error.js";
import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  const {name, description} = req.body;

  const userId = req.user?.id;

  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const existingPlaylist = await db.playlist.findUnique({
    where: {
      name_userId: {
        name,
        userId,
      },
    },
  });

  if (existingPlaylist) {
    throw new ApiError(400, "Playlist with this name already exists");
  }

  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });

  res
    .status(201)
    .json(new ApiResponse(201, {playlist}, "Playlist Created Successfully"));
});

export const getAllPlaylistDetails = asyncHandler(async (req, res) => {
  const playlist = await db.playlist.findMany({
    where: {
      userId: req.user?.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    throw new ApiError(404, "No playlist found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

export const getPlaylistDetails = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;

  const playlist = await db.playlist.findFirst({
    where: {
      id: playlistId,
      userId: req.user?.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    throw new ApiError(404, `No playlist with id ${playlistId} found`);
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

export const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const {problemIds} = req.body;

  const playlistId = req.params.id;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Problem IDs are required");
  }

  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId: req.user?.id,
    },
  });

  if (!playlist) {
    throw new ApiError(404, `No playlist with id ${playlistId} found`);
  }

  const existingProblems = await db.problemInPlaylist.findMany({
    where: {
      playlistId,
    },
    select: {
      problemId: true,
    },
  });

  const existingProblemIds = new Set(
    existingProblems.map((problem) => problem.problemId),
  );

  const newProblemIds = problemIds.filter(
    (problemId) => !existingProblemIds.has(problemId),
  );

  if (newProblemIds.length === 0) {
    throw new ApiError(400, "All problems already exist in this playlist");
  }

  const problemsInPlaylist = await db.problemInPlaylist.createMany({
    data: newProblemIds.map((problemId) => ({
      problemId,
      playlistId,
    })),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {problemsInPlaylist},
        "Problems Added In Playlist Successfully",
      ),
    );
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;

  const playlist = await db.playlist.delete({
    where: {
      id: playlistId,
      userId: req.user?.id,
    },
  });

  if (!playlist) {
    throw new ApiError(404, `No playlist with id ${playlistId} found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;
  const {problemIds} = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Problem IDs are required");
  }

  const problemsInPlaylist = await db.problemInPlaylist.deleteMany({
    where: {
      playlistId,
      problemId: {
        in: problemIds,
      },
    },
  });

  if (problemsInPlaylist.count === 0) {
    throw new ApiError(
      404,
      `No problems found in this playlist with id ${playlistId}`,
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {problemsInPlaylist},
        "Problems removed from playlist",
      ),
    );
});
