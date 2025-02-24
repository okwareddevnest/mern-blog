import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import "./PostList.css";

const PostList = ({ category = null }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError('');
        const endpoint = category ? `/post/fetch?category=${category}` : '/post/fetch';
        const { data } = await axiosInstance.get(endpoint);
        if (mounted) {
          setPosts(data);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        if (mounted) {
          // Don't show error for auth failures
          if (err.response?.status !== 401) {
            setError('Failed to load posts. Please try again later.');
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, [category]); // Only re-run when category changes

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="no-posts-message">
        No posts found{category ? ` in ${category}` : ''}.
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="post-image" />
          )}
          <div className="post-content">
            <span className="post-category">{post.category}</span>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="post-meta">
              <img 
                src={post.author?.avatar || 'https://via.placeholder.com/40'} 
                alt={post.author?.username || 'Anonymous'}
                className="author-avatar"
              />
              <span>{post.author?.username || 'Anonymous'}</span>
              <span>·</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
