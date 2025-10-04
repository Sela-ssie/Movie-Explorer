# Movie Explorer

A small React application built with Vite that browses movies from The Movie Database (TMDB) API. The app demonstrates a lightweight single-page app with search, favorites, paging, a movie details view, and client-side filters.

## Features

- Browse popular movies and search by title (debounced search).
- Favorite movies and persist favorites to localStorage.
- Movie details page with overview, cast, and trailer (if available).
- Pagination with "Load more" to fetch additional pages.
- Loading skeletons and lazy-loaded images for better perceived performance.
- Client-side filters: Year and Genre (genres loaded from TMDB).
- Accessible favorite button with aria-pressed and labels.

## Tech stack

- React (via Vite)
- React Router for client routing
- Fetch API for network requests to TMDB
- Plain CSS files for styling

## Project structure (frontend/src)

- components/
  - MovieCard.jsx - Card component that shows poster, title, release year, and favorite button.
  - NavBar.jsx - Top navigation with links to Home and Favorites.
- contexts/
  - MovieContext.jsx - React Context that stores favorites and exposes add/remove/isFavorite.
- pages/
  - Home.jsx - Main page with search, filters, pagination, and movie grid.
  - Favorites.jsx - Page that lists favorited movies.
  - MovieDetail.jsx - Detailed view for a single movie (credits + trailer).
- services/
  - api.js - Small wrapper around TMDB REST endpoints: popular movies, search, details, genres.
- css/
  - App.css, Home.css, MovieCard.css, Navbar.css, MovieDetail.css - styling for the app.
- main.jsx, App.jsx - app bootstrap and top-level routing with `MovieProvider`.
