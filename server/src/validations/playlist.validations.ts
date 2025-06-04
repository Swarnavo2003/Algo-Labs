import { z } from "zod";

export const playlistSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters long"),
  description: z.string().optional(),
});

export type PlaylistType = z.infer<typeof playlistSchema>;

export const AddProblemToPlaylistSchema = z.object({
  problemIds: z.array(z.string()).nonempty("Problem IDs are required"),
});

export type AddProblemToPlaylistType = z.infer<
  typeof AddProblemToPlaylistSchema
>;
