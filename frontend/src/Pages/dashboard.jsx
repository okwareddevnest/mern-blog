import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './dashboard.css';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    coverImage: "",
    tags: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/posts/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/posts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess("Post created successfully!");
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        coverImage: "",
        tags: []
      });
      fetchPosts(); // Refresh posts list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts(); // Refresh posts list
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Posts</h3>
            <p>{stats.totalPosts}</p>
          </div>
          <div className="stat-card">
            <h3>Total Views</h3>
            <p>{stats.totalViews}</p>
          </div>
          <div className="stat-card">
            <h3>Total Likes</h3>
            <p>{stats.totalLikes}</p>
          </div>
          <div className="stat-card">
            <h3>Total Comments</h3>
            <p>{stats.totalComments}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Post
        </button>
        <button
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Posts
        </button>
      </div>

      {activeTab === 'create' ? (
        <div className="create-post-section">
          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="2"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="10"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="travel">Travel</option>
                  <option value="food">Food</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="coverImage">Cover Image URL</label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </form>
        </div>
      ) : (
        <div className="manage-posts-section">
          <div className="posts-grid">
            {posts.map(post => (
              <div key={post._id} className="post-card">
                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} className="post-cover" />
                )}
                <div className="post-card-content">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="post-meta">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{post.views} views</span>
                  </div>
                  <div className="post-actions">
                    <Link to={`/edit-post/${post._id}`} className="edit-btn">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
