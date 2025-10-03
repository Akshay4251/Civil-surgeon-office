import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import { FaNewspaper } from 'react-icons/fa';
import './LatestNews.css'; // Reuse the same CSS

const NewsTickerStrip = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news for ticker:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (url, e) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const isNewNews = (createdAt) => {
    const newsDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now - newsDate) / (1000 * 60 * 60);
    return diffInHours < 48;
  };

  if (loading || news.length === 0) return null;

  return (
    <div className="news-ticker-container">
      <div className="news-ticker-label">
        <FaNewspaper className="news-icon" />
        <span>LATEST NEWS</span>
      </div>
      
      <div className="news-ticker-content">
        <div className="news-ticker-items">
          {/* First set */}
          {news.map((item) => (
            <span
              key={`ticker-1-${item.id}`}
              className="news-ticker-item"
              onClick={(e) => handleRedirect(item.news_url, e)}
            >
              {isNewNews(item.created_at) && (
                <span className="new-badge">NEW</span>
              )}
              <span className="news-title">{item.title}</span>
              <span className="separator">•</span>
            </span>
          ))}
          
          {/* Duplicate for seamless loop */}
          {news.map((item) => (
            <span
              key={`ticker-2-${item.id}`}
              className="news-ticker-item"
              onClick={(e) => handleRedirect(item.news_url, e)}
            >
              {isNewNews(item.created_at) && (
                <span className="new-badge">NEW</span>
              )}
              <span className="news-title">{item.title}</span>
              <span className="separator">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTickerStrip;