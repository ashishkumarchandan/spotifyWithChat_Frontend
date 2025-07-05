import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	audioRef: HTMLAudioElement | null;
	volume: number;
	currentTime: number;
	duration: number;

	// Audio management
	initializeAudio: () => void;
	setVolume: (volume: number) => void;
	seekTo: (time: number) => void;
	
	// Queue management
	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	
	// Playback controls
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	
	// Internal state updates
	updateCurrentTime: (time: number) => void;
	updateDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	audioRef: null,
	volume: 75,
	currentTime: 0,
	duration: 0,

	initializeAudio: () => {
		const audio = new Audio();
		audio.volume = get().volume / 100;
		
		// Event listeners
		audio.addEventListener('loadedmetadata', () => {
			get().updateDuration(audio.duration);
		});
		
		audio.addEventListener('timeupdate', () => {
			get().updateCurrentTime(audio.currentTime);
		});
		
		audio.addEventListener('ended', () => {
			get().playNext();
		});
		
		audio.addEventListener('error', (e) => {
			console.error('Audio error:', e);
			set({ isPlaying: false });
		});

		set({ audioRef: audio });
	},

	setVolume: (volume: number) => {
		const { audioRef } = get();
		set({ volume });
		if (audioRef) {
			audioRef.volume = volume / 100;
		}
	},

	seekTo: (time: number) => {
		const { audioRef } = get();
		if (audioRef) {
			audioRef.currentTime = time;
			set({ currentTime: time });
		}
	},

	updateCurrentTime: (time: number) => {
		set({ currentTime: time });
	},

	updateDuration: (duration: number) => {
		set({ duration });
	},

	initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];
		const { audioRef } = get();

		// Update activity
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		// Update state
		set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
		});

		// Load and play audio
		if (audioRef) {
			audioRef.src = song.audioUrl;
			audioRef.currentTime = 0;
			audioRef.play().catch(console.error);
		}
	},

	setCurrentSong: (song: Song | null) => {
		if (!song) return;

		const { audioRef, queue } = get();

		// Update activity
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		const songIndex = queue.findIndex((s) => s._id === song._id);
		
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});

		// Load and play audio
		if (audioRef) {
			audioRef.src = song.audioUrl;
			audioRef.currentTime = 0;
			audioRef.play().catch(console.error);
		}
	},

	togglePlay: () => {
		const { isPlaying, currentSong, audioRef } = get();
		const willStartPlaying = !isPlaying;

		// Update activity
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity:
					willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
			});
		}

		set({ isPlaying: willStartPlaying });

		// Control audio playback
		if (audioRef) {
			if (willStartPlaying) {
				audioRef.play().catch(console.error);
			} else {
				audioRef.pause();
			}
		}
	},

	playNext: () => {
		const { currentIndex, queue, audioRef } = get();
		const nextIndex = currentIndex + 1;

		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];

			// Update activity
			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
				});
			}

			set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
			});

			// Load and play audio
			if (audioRef) {
				audioRef.src = nextSong.audioUrl;
				audioRef.currentTime = 0;
				audioRef.play().catch(console.error);
			}
		} else {
			// No next song
			set({ isPlaying: false });

			// Update activity
			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: "Idle",
				});
			}

			if (audioRef) {
				audioRef.pause();
			}
		}
	},

	playPrevious: () => {
		const { currentIndex, queue, audioRef } = get();
		const prevIndex = currentIndex - 1;

		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];

			// Update activity
			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
				});
			}

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});

			// Load and play audio
			if (audioRef) {
				audioRef.src = prevSong.audioUrl;
				audioRef.currentTime = 0;
				audioRef.play().catch(console.error);
			}
		} else {
			// No previous song
			set({ isPlaying: false });

			// Update activity
			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: "Idle",
				});
			}

			if (audioRef) {
				audioRef.pause();
			}
		}
	},
}));