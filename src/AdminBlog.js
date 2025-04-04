import React, { useState, useEffect } from 'react';
import './css/Blog.css';

function AdminBlog() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState(() => {
    try {
      const savedPosts = localStorage.getItem('blog-posts');
      return savedPosts ? JSON.parse(savedPosts) : [];
    } catch (error) {
      console.error('Error loading posts:', error);
      return [];
    }
  });
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    author: '', 
    image: null 
  });
  const [isCreating, setIsCreating] = useState(false);
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    try {
      localStorage.setItem('blog-posts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  }, [posts]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        alert('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const post = {
      id: Date.now(),
      ...newPost,
      date: new Date().toLocaleDateString(),
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', author: '', image: null });
    setIsCreating(false);
  };

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Admin Dashboard - Plant Health Blog</h1>
        <div className="admin-controls">
          <button 
            className="create-post-btn"
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating ? 'Cancel' : 'Create New Post'}
          </button>
          <button 
            className="logout-btn"
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </button>
        </div>
      </div>

      {isCreating && (
        <form className="post-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={newPost.author}
            onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="image-input"
          />
          <textarea
            placeholder="Content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
          <button type="submit">Publish Post</button>
        </form>
      )}

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card admin-post">
            {post.image && (
              <div className="image-container">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="post-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                  }}
                />
              </div>
            )}
            <div className="post-content-wrapper">
              <h2>{post.title}</h2>
              <p className="post-meta">
                By {post.author || 'Admin'} | {post.date}
              </p>
              <div className="post-content">{post.content}</div>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(post.id)}
              >
                Delete Post
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBlog;