import { useState } from 'react';
import axios from 'axios';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    bio: user.bio || '',
    avatar: user.avatar || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${API_URL}/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.setItem('user', JSON.stringify(data));
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <img
            src={user.avatar || 'https://via.placeholder.com/150'}
            alt={user.username}
            className="profile-avatar"
          />
          <h1>{user.username}</h1>
          <p className="user-role">{user.role}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h2>Profile Information</h2>
            <button
              className="btn btn-secondary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-control">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-control">
                <label htmlFor="avatar">Avatar URL</label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <label>Username</label>
                <p>{user.username}</p>
              </div>
              <div className="info-group">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-group">
                <label>Bio</label>
                <p>{user.bio || 'No bio added yet.'}</p>
              </div>
              <div className="info-group">
                <label>Member Since</label>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>

        <div className="profile-card">
          <h2>Your Activity</h2>
          <div className="activity-stats">
            <div className="stat-item">
              <span className="stat-value">{user.posts?.length || 0}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.comments?.length || 0}</span>
              <span className="stat-label">Comments</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.likes?.length || 0}</span>
              <span className="stat-label">Likes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 