import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import PostList from "../components/Post/PostList";
import './Home.css';

const Home = ({ user, onShowAuthModal }) => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [postsResponse, categoriesResponse] = await Promise.all([
          axiosInstance.get('/post/featured').catch(() => ({ data: [] })),
          axiosInstance.get('/category').catch(() => ({ data: [] }))
        ]);

        setFeaturedPosts(postsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this only runs once on mount

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Blog Platform</h1>
          <p>Discover stories, thinking, and expertise from writers on any topic.</p>
          {!user && (
            <button className="btn btn-primary" onClick={onShowAuthModal}>
              Start Writing
            </button>
          )}
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="featured-section">
          <h2>Featured Posts</h2>
          <div className="featured-posts">
            {featuredPosts.map(post => (
              <div key={post._id} className="featured-post-card">
                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} className="featured-post-image" />
                )}
                <div className="featured-post-content">
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
        </section>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="categories-header">
            <h2>Explore by Category</h2>
            <div className="categories-filter">
              <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category._id}
                  className={`category-btn ${selectedCategory === category.slug ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posts List Section */}
      <section className="posts-section">
        <h2>Latest Posts</h2>
        <PostList key={selectedCategory} category={selectedCategory === 'all' ? null : selectedCategory} />
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Subscribe to our Newsletter</h2>
          <p>Get the latest posts delivered right to your inbox.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
