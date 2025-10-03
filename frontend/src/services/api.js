const Base_URL = "https://api.themoviedb.org/3";

// Read API key from Vite environment variable. Do NOT commit your real key.
const API_Key = import.meta.env.VITE_TMDB_API_KEY;

if (!API_Key) {
    console.warn('VITE_TMDB_API_KEY is not set. Please create a .env file with VITE_TMDB_API_KEY=your_key');
}

const fetchJson = async (url) => {
    if (!API_Key) {
        throw new Error('Missing TMDB API key. Set VITE_TMDB_API_KEY in your .env file.');
    }
    const response = await fetch(url);
    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`);
    }
    return response.json();
};

export const fetchPopularMovies = async (page = 1) => {
    const url = `${Base_URL}/movie/popular?api_key=${API_Key}&language=en-US&page=${page}`;
    const data = await fetchJson(url);
    return { results: data.results || [], page: data.page || 1, total_pages: data.total_pages || 1 };
}

export const searchMovies = async (query, page = 1) => {
    const url = `${Base_URL}/search/movie?api_key=${API_Key}&query=${encodeURIComponent(query)}&page=${page}`;
    const data = await fetchJson(url);
    return { results: data.results || [], page: data.page || 1, total_pages: data.total_pages || 1 };
}

export const getMovieDetails = async (id) => {
    const url = `${Base_URL}/movie/${id}?api_key=${API_Key}&append_to_response=videos,credits`;
    return fetchJson(url);
}

export const fetchGenres = async () => {
    const url = `${Base_URL}/genre/movie/list?api_key=${API_Key}&language=en-US`;
    const data = await fetchJson(url);
    return data.genres || [];
}
