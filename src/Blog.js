import React, { useState, useEffect } from 'react';
import './css/Blog.css';

function Blog() {
  const [posts, setPosts] = useState(() => {
    try {
      const savedPosts = localStorage.getItem('blog-posts');
      return savedPosts ? JSON.parse(savedPosts) : [];
    } catch (error) {
      console.error('Error loading posts:', error);
      return [];
    }
  });

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Plant Health Blog</h1>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <h2>No blog posts available yet.</h2>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
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
                <div className="post-content">
                  {post.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Blog;