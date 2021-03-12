const { getTracks } = require("spotify-url-info");
const yts = require('yt-search');
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

const YD = new YoutubeMp3Downloader({
    "ffmpegPath": ffmpeg.path,       // FFmpeg binary location
    "outputPath": "./Songs",                // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 2,                  // Download parallelism (default: 1)
    "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});

async function run() {
    const response = await getTracks("ENTER URL HERE");
    var song_queries = [];
    response.forEach((song) => {
        const search_query = `${song.name} by ${song.artists.map((artist) => artist.name).join(", ")}`;
        song_queries.push(search_query);
    });
    for (const search_query of song_queries) {
        const r = await yts(search_query);
        const video_result = r.videos[0];
        YD.download(video_result.videoId);
    }
}

run().then(r => console.log(r));
