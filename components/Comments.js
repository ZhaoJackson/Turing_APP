import { useState } from 'react';
import { useGame } from '../contexts/GameContext';

export default function Comments({ promptId }) {
  const { comments, addComment, darkMode } = useGame();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(promptId, newComment.trim());
      setNewComment('');
    }
  };

  const promptComments = comments[promptId] || [];

  return (
    <div className="comments-section">
      <h3>Discussion</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
        />
        <button type="submit">Post Comment</button>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {promptComments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <span className="comment-date">
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </div>
            <p className="comment-text">{comment.text}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .comments-section {
          margin-top: 20px;
          padding: 20px;
          border-radius: 8px;
          background: ${darkMode ? '#2a2a2a' : '#f5f5f5'};
        }

        .comment-form {
          margin-bottom: 20px;
        }

        textarea {
          width: 100%;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
          margin-bottom: 10px;
          background: ${darkMode ? '#333' : '#fff'};
          color: ${darkMode ? '#fff' : '#000'};
        }

        button {
          padding: 8px 16px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background: #0051a8;
        }

        .comments-list {
          margin-top: 20px;
        }

        .comment {
          padding: 15px;
          border-bottom: 1px solid ${darkMode ? '#444' : '#ddd'};
        }

        .comment-header {
          margin-bottom: 8px;
        }

        .comment-date {
          font-size: 0.8em;
          color: #666;
        }

        .comment-text {
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
} 