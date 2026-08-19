import './index.css';

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Sentiment from 'sentiment';

type Post = {
  title: string;
  author?: string;
  score?: number;
  url?: string;
  subreddit?: string;
};

type AnalyzedPost = Post & {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  sentimentScore: number;
};

const sentimentAnalyzer = new Sentiment();

export const Splash = () => {
  const [subreddit, setSubreddit] = useState('');
  const [posts, setPosts] = useState<AnalyzedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    const name = subreddit.trim().replace(/^r\//i, '');

    if (!name) {
      setError('Please enter a subreddit.');
      return;
    }

    setLoading(true);
    setError('');
    setPosts([]);

    try {
      const response = await fetch(
        `/api/hot?subreddit=${encodeURIComponent(name)}`
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || 'Server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Could not fetch posts.');
      }

      const fetchedPosts: Post[] = data.posts || [];

      const analyzedPosts: AnalyzedPost[] = fetchedPosts.map((post) => {
        const result = sentimentAnalyzer.analyze(post.title);

        let sentiment: 'Positive' | 'Neutral' | 'Negative';

        if (result.score > 0) {
          sentiment = 'Positive';
        } else if (result.score < 0) {
          sentiment = 'Negative';
        } else {
          sentiment = 'Neutral';
        }

        return {
          ...post,
          sentiment,
          sentimentScore: result.score,
        };
      });

      setPosts(analyzedPosts);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  const positiveCount = posts.filter(
    (post) => post.sentiment === 'Positive'
  ).length;

  const neutralCount = posts.filter(
    (post) => post.sentiment === 'Neutral'
  ).length;

  const negativeCount = posts.filter(
    (post) => post.sentiment === 'Negative'
  ).length;

  const getPercentage = (count: number) => {
    if (posts.length === 0) return 0;

    return Math.round((count / posts.length) * 100);
  };

  const getEmoji = (sentiment: string) => {
    if (sentiment === 'Positive') return '😊';
    if (sentiment === 'Negative') return '😠';
    return '😐';
  };

  const getSentimentClasses = (sentiment: string) => {
    if (sentiment === 'Positive') {
      return 'bg-green-900/40 border-green-700 text-green-300';
    }

    if (sentiment === 'Negative') {
      return 'bg-red-900/40 border-red-700 text-red-300';
    }

    return 'bg-yellow-900/40 border-yellow-700 text-yellow-300';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-5 py-10">
      <div className="max-w-5xl mx-auto">

        <header className="text-center mb-10">

          <p className="text-sm tracking-[0.25em] text-orange-500 font-bold mb-4">
            REDDIT SENTIMENT ANALYZER
          </p>

          <h1 className="text-4xl md:text-6xl font-bold">
            The Subreddit Vibe Check
          </h1>

          <p className="text-gray-400 mt-5 text-lg">
            Analyze the mood of the top 50 Hot Reddit post titles.
          </p>

        </header>

        <section className="bg-white rounded-3xl p-6 shadow-xl">

          <div className="flex items-center bg-gray-100 rounded-2xl px-5 py-4">

            <span className="text-gray-500 text-xl mr-2">
              r/
            </span>

            <input
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCheck();
                }
              }}
              placeholder="technology"
              className="flex-1 bg-transparent text-gray-900 text-xl outline-none"
            />

          </div>

          <button
            onClick={handleCheck}
            disabled={loading}
            className="w-full mt-4 rounded-2xl bg-orange-600 text-white py-4 text-xl font-bold hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing Vibe...' : 'Check Vibe'}
          </button>

        </section>

        {loading && (
          <div className="mt-8 text-center text-gray-400">

            <div className="text-4xl mb-3">
              🔍
            </div>

            <p className="text-lg">
              Fetching Hot posts and analyzing sentiment...
            </p>

          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-950 border border-red-500 rounded-2xl p-5 text-red-200">
            {error}
          </div>
        )}

        {posts.length > 0 && (
          <>

            <section className="mt-10">

              <div className="text-center mb-7">

                <p className="text-orange-500 font-bold tracking-widest text-sm">
                  COMMUNITY VIBE
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  r/{subreddit.replace(/^r\//i, '')}
                </h2>

                <p className="text-gray-400 mt-2">
                  {posts.length} Hot post titles analyzed
                </p>

              </div>

              <div className="grid md:grid-cols-3 gap-4">

                <div className="bg-green-950/50 border border-green-800 rounded-2xl p-6 text-center">

                  <div className="text-4xl">
                    😊
                  </div>

                  <p className="text-green-400 font-bold mt-3">
                    POSITIVE
                  </p>

                  <p className="text-4xl font-bold mt-2">
                    {positiveCount}
                  </p>

                  <p className="text-gray-400 mt-1">
                    {getPercentage(positiveCount)}%
                  </p>

                </div>

                <div className="bg-yellow-950/40 border border-yellow-800 rounded-2xl p-6 text-center">

                  <div className="text-4xl">
                    😐
                  </div>

                  <p className="text-yellow-400 font-bold mt-3">
                    NEUTRAL
                  </p>

                  <p className="text-4xl font-bold mt-2">
                    {neutralCount}
                  </p>

                  <p className="text-gray-400 mt-1">
                    {getPercentage(neutralCount)}%
                  </p>

                </div>

                <div className="bg-red-950/40 border border-red-800 rounded-2xl p-6 text-center">

                  <div className="text-4xl">
                    😠
                  </div>

                  <p className="text-red-400 font-bold mt-3">
                    NEGATIVE
                  </p>

                  <p className="text-4xl font-bold mt-2">
                    {negativeCount}
                  </p>

                  <p className="text-gray-400 mt-1">
                    {getPercentage(negativeCount)}%
                  </p>

                </div>

              </div>

            </section>

            <section className="mt-12">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <p className="text-orange-500 font-bold tracking-widest text-sm">
                    HOT POSTS
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    What Reddit is talking about
                  </h2>

                </div>

                <div className="bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-300">
                  {posts.length} posts
                </div>

              </div>

              <div className="space-y-4">

                {posts.map((post, index) => (
                  <article
                    key={`${post.title}-${index}`}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
                  >

                    <div className="flex gap-4">

                      <div className="text-gray-500 font-bold min-w-8">
                        #{index + 1}
                      </div>

                      <div className="flex-1">

                        <h3 className="text-lg font-semibold leading-relaxed">
                          {post.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 mt-4">

                          <span className="text-gray-400 text-sm">
                            ⬆ {post.score ?? 0}
                          </span>

                          <span className="text-gray-400 text-sm">
                            u/{post.author ?? 'unknown'}
                          </span>

                          <span
                            className={`border rounded-full px-3 py-1 text-sm font-bold ${getSentimentClasses(
                              post.sentiment
                            )}`}
                          >
                            {getEmoji(post.sentiment)}{' '}
                            {post.sentiment}
                          </span>

                          <span className="text-gray-500 text-sm">
                            score: {post.sentimentScore}
                          </span>

                        </div>

                      </div>

                    </div>

                  </article>
                ))}

              </div>

            </section>

          </>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center mt-12 text-gray-500">

            <div className="text-5xl">
              🔎
            </div>

            <p className="text-xl mt-4">
              Enter a subreddit to start the vibe check.
            </p>

          </div>
        )}

      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);