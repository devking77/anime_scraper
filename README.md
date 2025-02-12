Scraping server that provide anime details and streaming links

# Anime API

This API provides endpoints to fetch anime details, servers, and various anime categories.

## Base URL
```
http://your-api-url/
```

## Endpoints

### 1. Fetch Anime Details
**Endpoint:**
```
GET /animeDetails/:anime_id
```
**Description:**
Fetches detailed information about an anime.

**Example:**
```
GET /animeDetails/12345
```

---

### 2. Fetch Servers
**Endpoint:**
```
GET /servers/:anime_id
```
**Description:**
Fetches available servers for an anime.

**Example:**
```
GET /servers/12345
```

---

### 3. Search Anime
**Endpoint:**
```
GET /search/:query/:page?
```
**Description:**
Searches for anime based on the query.

**Parameters:**
- `query` (required): The search term.
- `page` (optional, default: 1): The page number of results.

**Example:**
```
GET /search/naruto/1
```

---

### 4. Fetch Top Airing Anime
**Endpoint:**
```
GET /topAiring/:page?
```
**Description:**
Fetches currently airing anime.

**Example:**
```
GET /topAiring/1
```

---

### 5. Fetch Most Popular Anime
**Endpoint:**
```
GET /mostPopular/:page?
```
**Description:**
Fetches the most popular anime.

**Example:**
```
GET /mostPopular/1
```

---

### 6. Fetch Most Favorite Anime
**Endpoint:**
```
GET /mostFavourite/:page?
```
**Description:**
Fetches the most favorited anime.

**Example:**
```
GET /mostFavourite/1
```

---

### 7. Fetch Latest Completed Anime
**Endpoint:**
```
GET /latestCompleted/:page?
```
**Description:**
Fetches the latest completed anime.

**Example:**
```
GET /latestCompleted/1
```

---

### 8. Fetch Recently Added Anime
**Endpoint:**
```
GET /recentlyAdded/:page?
```
**Description:**
Fetches recently added anime.

**Example:**
```
GET /recentlyAdded/1
```

---

### 9. Fetch Top Upcoming Anime
**Endpoint:**
```
GET /topUpcoming/:page?
```
**Description:**
Fetches upcoming anime.

**Example:**
```
GET /topUpcoming/1
```

---

### 10. Fetch Special Anime
**Endpoint:**
```
GET /special/:page?
```
**Description:**
Fetches special category anime.

**Example:**
```
GET /special/1
```

---

### 11. Fetch Spotlight Anime
**Endpoint:**
```
GET /spotlight
```
**Description:**
Fetches spotlight anime.

**Example:**
```
GET /spotlight
```

---

## Response Format
All endpoints return JSON responses with structured anime data.

---

## Notes
- All `:page?` parameters are optional and default to page 1.
- `:anime_id` should be replaced with the actual anime ID from the database.

---

## License
This API is provided as-is. Use responsibly.

