import express from 'express';

import {
  context,
  createServer,
  getServerPort,
  reddit,
} from '@devvit/web/server';

import type {
  MenuItemRequest,
  UiResponse,
} from '@devvit/web/shared';

const app = express();

app.use(express.json());

/*
 * Fetch the top 50 Hot posts from a selected subreddit.
 */
app.get('/api/hot', async (req, res) => {
  try {
    const subreddit = String(req.query.subreddit || '')
      .trim()
      .replace(/^r\//i, '');

    if (!subreddit) {
      return res.status(400).json({
        error: 'Please provide a subreddit.',
      });
    }

    const posts = await reddit
      .getHotPosts({
        subredditName: subreddit,
        limit: 50,
      })
      .all();

    const results = posts.slice(0, 50).map((post) => ({
      title: post.title,
      author: post.authorName,
      score: post.score,
      url: post.url,
      subreddit: post.subredditName,
    }));

    return res.json({
      subreddit,
      posts: results,
    });
  } catch (error) {
    console.error('Hot posts error:', error);

    return res.status(500).json({
      error: 'Could not fetch subreddit posts.',
    });
  }
});

/*
 * Creates the custom Vibe Check post from the moderator menu.
 */
app.post<string, never, UiResponse, MenuItemRequest>(
  '/internal/menu/post-create',
  async (_req, res) => {
    try {
      const subredditName = context.subredditName;

      if (!subredditName) {
        return res.json({
          showToast: {
            text: 'Could not determine the subreddit.',
            appearance: 'neutral',
          },
        });
      }

      const post = await reddit.submitCustomPost({
        subredditName,
        title: 'The Subreddit Vibe Check',
        entry: 'default',
        styles: {
          backgroundColor: '#FFFFFFFF',
          backgroundColorDark: '#030712FF',
        },
      });

      return res.json({
        showToast: {
          text: 'Vibe Check post created!',
          appearance: 'success',
        },
        navigateTo: post,
      });
    } catch (error) {
      console.error('Create post error:', error);

      return res.json({
        showToast: {
          text: 'Could not create the Vibe Check post.',
          appearance: 'neutral',
        },
      });
    }
  }
);

const port = getServerPort();

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});