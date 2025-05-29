import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const usePlaylistStore = create((set, get) => ({
      playlists: [],
      currentPlaylist: null,
      isLoading: false,
      error: null,

      createPlaylist: async (playlistData) => {
            try {
                  set({ isLoading: true });

                  const payload = {
                        title: playlistData.title || playlistData.name,
                        description: playlistData.description,
                        banner: playlistData.banner || null,
                  };

                  console.log("Payload being sent:", payload);

                  const response = await axiosInstance.post(
                        "/playlist/create-playlist",
                        payload
                  );

                  const newPlaylist = response.data.data;

                  set((state) => ({
                        playlists: [...state.playlists, newPlaylist],
                  }));

                  toast.success("Playlist created successfully");
                  return newPlaylist;
            } catch (error) {
                  console.error("Error creating playlist:", error);
                  toast.error(error.response?.data?.message || "Failed to create playlist");
                  throw error;
            } finally {
                  set({ isLoading: false });
            }
      },

      getAllPlaylists: async () => {
            try {
                  set({ isLoading: true });
                  const response = await axiosInstance.get("/playlist");
                  console.log("All Playlists:", response.data);

                  set({ playlists: response.data.data });
            } catch (error) {
                  console.error("Error fetching playlists:", error);
                  toast.error("Failed to fetch playlists");
            } finally {
                  set({ isLoading: false });
            }
      },

      getPlaylistDetails: async (playlistId) => {
            try {
                  set({ isLoading: true });
                  const response = await axiosInstance.get(`/playlist/${playlistId}`);
                  console.log("Playlist Details:", response.data);

                  set({ currentPlaylist: response.data.data });
            } catch (error) {
                  console.error("Error fetching playlist details:", error);
                  toast.error("Failed to fetch playlist details");
            } finally {
                  set({ isLoading: false });
            }
      },

      addProblemToPlaylist: async (playlistId, problemIds) => {
            try {
                  set({ isLoading: true });

                  console.log("Sending problems to playlist:", {
                        playlistId,
                        problemId: problemIds,
                  });

                  await axiosInstance.post(`/playlist/${playlistId}/add-problem`, {
                        problemId: problemIds,
                  });

                  toast.success("Problem added to playlist");

                  // Refresh the playlist details
                  if (get().currentPlaylist?.id === playlistId) {
                        await get().getPlaylistDetails(playlistId);
                  }
            } catch (error) {
                  console.error("Error adding problem to playlist:", error);
                  toast.error("Failed to add problem to playlist");
            } finally {
                  set({ isLoading: false });
            }
      },



      removeProblemFromPlaylist: async (playlistId, problemIds) => {
            try {
                  set({ isLoading: true });
                  await axiosInstance.post(`/playlist/${playlistId}/remove-problems`, {
                        problemIds,
                  });

                  toast.success("Problem removed from playlist");

                  // Refresh the playlist details
                  if (get().currentPlaylist?.id === playlistId) {
                        await get().getPlaylistDetails(playlistId);
                  }
            } catch (error) {
                  console.error("Error removing problem from playlist:", error);
                  toast.error("Failed to remove problem from playlist");
            } finally {
                  set({ isLoading: false });
            }
      },

      deletePlaylist: async (playlistId) => {
            try {
                  set({ isLoading: true });
                  await axiosInstance.delete(`/playlist/${playlistId}`);

                  set((state) => ({
                        playlists: state.playlists.filter((p) => p.id !== playlistId),
                  }));

                  toast.success("Playlist deleted successfully");
            } catch (error) {
                  console.error("Error deleting playlist:", error);
                  toast.error("Failed to delete playlist");
            } finally {
                  set({ isLoading: false });
            }
      },
}));