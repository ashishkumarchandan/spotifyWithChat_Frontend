// 🎵 Single track definition
export interface Song {
  _id: string; // 🆔 Unique database ID
  title: string; // 📛 Song name
  artist: string; // 👤 Performing artist
  albumId: string | null; // 📀 Parent album ID (optional)
  imageUrl: string; // 🖼️ Cover art URL
  audioUrl: string; // 🔈 Playable audio URL
  duration: number; // ⏱️ Length in seconds
  createdAt: string; // 📅 Creation timestamp
  updatedAt: string; // 🔄 Last update timestamp
}

// 📀 Music album collection
export interface Album {
  _id: string; // 🆔 Unique database ID
  title: string; // 📛 Album name
  artist: string; // 👤 Primary artist
  imageUrl: string; // 🖼️ Cover art URL
  releaseYear: number; // 📅 Year released
  songs: Song[]; // 🎵▶️ Track listing
}

// 📊 Application statistics
export interface Stats {
  totalSongs: number; // 🎵▶️ Total tracks count
  totalAlbums: number; // 📀 Total albums count
  totalUsers: number; // 👥 Registered users
  totalArtists: number; // 👤 Unique artists
}

// 💬 Chat message structure
export interface Message {
  _id: string; // 🆔 Unique database ID
  senderId: string; // 👤▶️ Sender's user ID
  reciverId: string; // 👤◀️ Receiver's user ID
  content: string; // 📝 Message text
  createdAt: string; // 📅 Creation timestamp
  updatedAt: string; // 🔄 Last update timestamp
}

// 👤 User profile definition
export interface User {
  _id: string; // 🆔 Unique database ID
  clerkId: string; // 🔐 Clerk authentication ID
  fullName: string; // 🪪 Display name
  imageUrl: string; // 🖼️ Profile picture URL
}
