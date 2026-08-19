# The Subreddit Vibe Check

A Reddit sentiment-analysis dashboard that fetches the top Hot posts from a selected subreddit and analyzes the sentiment of their titles.

## Features

- Search for any public subreddit
- Fetch up to 50 Hot posts
- Client-side sentiment analysis of post titles
- Positive, Neutral, and Negative classification
- Overall sentiment counts and percentages
- Individual sentiment result for every post
- Loading and error handling
- Reddit API integration using Devvit

## Tech Stack

- React
- TypeScript
- Reddit Devvit
- Reddit API
- Sentiment.js
- Express
- Vite
- Tailwind CSS

## How It Works

1. The user enters a subreddit such as `technology`.
2. The React frontend sends the subreddit name to the Devvit server.
3. The server fetches up to 50 Hot posts using Reddit's API.
4. The titles are returned to the client.
5. Sentiment.js analyzes each title.
6. Each post is classified as Positive, Neutral, or Negative.
7. The dashboard displays the overall community vibe and individual post sentiment.

## Sentiment Classification

- Score greater than 0 → Positive
- Score equal to 0 → Neutral
- Score less than 0 → Negative

## Live Demo

The application is currently running as a Reddit Devvit playtest:

https://www.reddit.com/r/vibe_check_analy_dev3/?playtest=vibe-check-analyzer

Note: The Devvit playtest may require Reddit login/developer access.

## Reddit API Note

Reddit's current developer workflow requires authenticated API access. This project therefore uses Reddit's Devvit platform to fetch subreddit Hot posts instead of making an unauthenticated request directly from the browser.

Public Devvit distribution requires Reddit's publishing and app-review process.

## Running Locally

Install dependencies:

```bash
npm install
