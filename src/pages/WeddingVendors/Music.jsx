import { useState } from "react";
import { Play, Pause, Heart, Plus, Volume2, SkipForward, SkipBack } from "lucide-react";

const WeddingMusic = () => {
    const [currentSong, setCurrentSong] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeCategory, setActiveCategory] = useState("ceremony");

    const musicCategories = [
        { key: "ceremony", label: "Ceremony" },
        { key: "cocktail", label: "Cocktail Hour" },
        { key: "reception", label: "Reception" },
        { key: "first-dance", label: "First Dance" }
    ];

    const songs = {
        ceremony: [
            { id: 1, title: "A Thousand Years", artist: "Christina Perri", duration: "4:45", favorite: true },
            { id: 2, title: "Perfect", artist: "Ed Sheeran", duration: "4:23", favorite: false },
            { id: 3, title: "All of Me", artist: "John Legend", duration: "4:29", favorite: true },
            { id: 4, title: "Marry Me", artist: "Train", duration: "4:01", favorite: false }
        ],
        cocktail: [
            { id: 5, title: "Come Away With Me", artist: "Norah Jones", duration: "3:18", favorite: true },
            { id: 6, title: "The Way You Look Tonight", artist: "Frank Sinatra", duration: "3:25", favorite: false },
            { id: 7, title: "La Vie En Rose", artist: "Édith Piaf", duration: "3:30", favorite: true }
        ],
        reception: [
            { id: 8, title: "Can't Stop the Feeling", artist: "Justin Timberlake", duration: "3:56", favorite: false },
            { id: 9, title: "Happy", artist: "Pharrell Williams", duration: "3:53", favorite: true },
            { id: 10, title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", duration: "4:30", favorite: false }
        ],
        "first-dance": [
            { id: 11, title: "Thinking Out Loud", artist: "Ed Sheeran", duration: "4:41", favorite: true },
            { id: 12, title: "At Last", artist: "Etta James", duration: "3:01", favorite: true },
            { id: 13, title: "Make You Feel My Love", artist: "Adele", duration: "3:32", favorite: false }
        ]
    };

    const currentPlaylist = songs[activeCategory] || [];
    const currentTrack = currentPlaylist[currentSong] || currentPlaylist[0];

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
        setCurrentSong((prev) =>
            prev >= currentPlaylist.length - 1 ? 0 : prev + 1
        );
    };

    const prevSong = () => {
        setCurrentSong((prev) =>
            prev <= 0 ? currentPlaylist.length - 1 : prev - 1
        );
    };

    const toggleFavorite = (songId) => {
        // In a real app, this would update the song's favorite status
        console.log(`Toggled favorite for song ${songId}`);
    };

    return (
        <section className="py-20 bg-gradient-to-br from-rose-50 via-white to-amber-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="mb-6 inline-flex items-center gap-2 bg-rose-100 rounded-full px-4 py-2">
                        <Volume2 className="w-4 h-4 text-rose-500" />
                        <span className="text-rose-700 font-medium">Wedding Music</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Perfect Soundtrack for Your
                        <span className="block bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                            Special Day
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Curated playlists to accompany every moment of your wedding celebration.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Music Player */}
                    <div className="lg:col-span-1">
                        <div className="p-6 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-3xl shadow-xl">
                            <div className="text-center mb-6">
                                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-rose-400 to-amber-400 rounded-3xl flex items-center justify-center shadow-lg">
                                    <Volume2 className="w-16 h-16 text-white" />
                                </div>
                                {currentTrack && (
                                    <>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{currentTrack.title}</h3>
                                        <p className="text-gray-600">{currentTrack.artist}</p>
                                        <p className="text-sm text-gray-500">{currentTrack.duration}</p>
                                    </>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-2 rounded-full w-1/3"></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>1:23</span>
                                    <span>{currentTrack?.duration || "0:00"}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <button
                                    variant="outline"
                                    size="icon"
                                    onClick={prevSong}
                                    className="rounded-full border-rose-200 hover:bg-rose-50"
                                >
                                    <SkipBack className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={togglePlay}
                                    className="w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg"
                                >
                                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                                </button>

                                <button
                                    variant="outline"
                                    size="icon"
                                    onClick={nextSong}
                                    className="rounded-full border-rose-200 hover:bg-rose-50"
                                >
                                    <SkipForward className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Volume */}
                            <div className="flex items-center gap-3">
                                <Volume2 className="w-4 h-4 text-gray-500" />
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-2 rounded-full w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Playlist */}
                    <div className="lg:col-span-2">
                        <div className="p-6 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-3xl shadow-xl">
                            {/* Category Tabs */}
                            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
                                {musicCategories.map((category) => (
                                    <button
                                        key={category.key}
                                        onClick={() => {
                                            setActiveCategory(category.key);
                                            setCurrentSong(0);
                                        }}
                                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${activeCategory === category.key
                                                ? "bg-white text-rose-600 shadow-md"
                                                : "text-gray-600 hover:text-rose-600"
                                            }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>

                            {/* Song List */}
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {currentPlaylist.map((song, index) => (
                                    <div
                                        key={song.id}
                                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${index === currentSong
                                                ? "bg-gradient-to-r from-rose-50 to-amber-50 border-2 border-rose-200"
                                                : "bg-gray-50 hover:bg-gray-100"
                                            }`}
                                        onClick={() => setCurrentSong(index)}
                                    >
                                        <div className="flex-shrink-0">
                                            <button
                                                variant="ghost"
                                                size="icon"
                                                className="w-10 h-10 rounded-full"
                                            >
                                                {index === currentSong && isPlaying ? (
                                                    <Pause className="w-4 h-4" />
                                                ) : (
                                                    <Play className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">{song.title}</h4>
                                            <p className="text-gray-600 text-sm truncate">{song.artist}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-500">{song.duration}</span>
                                            <button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(song.id);
                                                }}
                                                className="rounded-full"
                                            >
                                                <Heart
                                                    className={`w-4 h-4 ${song.favorite
                                                            ? "fill-rose-500 text-rose-500"
                                                            : "text-gray-400 hover:text-rose-500"
                                                        }`}
                                                />
                                            </button>
                                            <button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-full"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Custom Song */}
                            <div className="mt-6 p-4 border-2 border-dashed border-rose-200 rounded-2xl text-center">
                                <Plus className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                                <p className="text-gray-600 mb-2">Add your own special song</p>
                                <button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                                    Upload Music
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Music Packages */}
                <div className="mt-16">
                    <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Music Packages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Essential",
                                price: "$299",
                                features: ["Pre-selected playlists", "Basic audio setup", "4-hour coverage"]
                            },
                            {
                                name: "Premium",
                                price: "$499",
                                features: ["Custom playlists", "Professional DJ", "8-hour coverage", "Special requests"]
                            },
                            {
                                name: "Luxury",
                                price: "$799",
                                features: ["Fully customized music", "Live musicians coordination", "Full day coverage", "Sound engineering"]
                            }
                        ].map((pkg, index) => (
                            <div key={index} className="p-6 text-center border border-rose-100 rounded-2xl hover:shadow-lg transition-shadow">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h4>
                                <div className="text-3xl font-bold text-rose-600 mb-4">{pkg.price}</div>
                                <ul className="space-y-2 mb-6">
                                    {pkg.features.map((feature, idx) => (
                                        <li key={idx} className="text-gray-600">{feature}</li>
                                    ))}
                                </ul>
                                <button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                                    Choose Package
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WeddingMusic;