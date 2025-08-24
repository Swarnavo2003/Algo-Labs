import {Router} from "express";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylistDetails,
  getPlaylistDetails,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.get("/", isAuthenticated, getAllPlaylistDetails);
playlistRouter.get("/:id", isAuthenticated, getPlaylistDetails);
playlistRouter.post("/create-playlist", isAuthenticated, createPlaylist);
playlistRouter.post("/:id/add-problem", isAuthenticated, addProblemToPlaylist);
playlistRouter.delete(
  "/:id/remove-problem",
  isAuthenticated,
  removeProblemFromPlaylist,
);
playlistRouter.delete("/:id", isAuthenticated, deletePlaylist);

export default playlistRouter;
