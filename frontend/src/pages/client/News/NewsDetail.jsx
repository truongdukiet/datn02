import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function NewsDetail() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/news/${slug}`)
      .then(res => res.json())
      .then(data => setNews(data));
  }, [slug]);

  if (!news) return <div>Loading...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <Link to="/news" className="btn btn-outline-primary mb-4">← Quay lại danh sách</Link>
      <h1 className="mb-3">{news.title}</h1>
      <span className="text-muted d-block mb-2">
        {news.published_at
          ? new Date(news.published_at).toLocaleDateString()
          : ""}
        {news.author && (
          <> | Tác giả: {news.author.Fullname || news.author.Username}</>
        )}
      </span>
      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="img-fluid rounded mb-4"
          style={{ maxHeight: 400, objectFit: "cover", width: "100%" }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: news.content }} className="mb-5" />
    </div>
  );
}

export default NewsDetail;
