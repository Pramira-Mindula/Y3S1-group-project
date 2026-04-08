import { useEffect, useState } from "react";
import axios from "axios";

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/safety/news`);
        const safeArticles = Array.isArray(res.data) ? res.data.slice(0, 6) : [];
        setArticles(safeArticles);
      } catch (err) {
        setError("Unable to load latest news right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="eh-section">
      <div className="eh-section-label">Latest News</div>
      <div className="eh-section-header">
        <div className="eh-section-title">
          Women Safety News<br />From Around the World
        </div>
        <div className="eh-section-sub">
          Stay updated with verified safety-related headlines and community awareness stories.
        </div>
      </div>

      {loading && <p>Loading news...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="eh-news-grid">
          {articles.map((article, index) => (
            <a
              key={article.url || index}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="eh-news-card"
            >
              {article.urlToImage ? (
                <img src={article.urlToImage} alt={article.title || "News image"} className="eh-news-image" />
              ) : (
                <div className="eh-news-image eh-news-image-placeholder">No image</div>
              )}
              <div className="eh-news-content">
                <h4>{article.title || "Untitled article"}</h4>
                <p>{article.description || "Click to read the full article."}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
