import { useState, useEffect } from 'react'
import './App.css'

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
}

interface Comment {
  id: number;
  text: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

  useEffect(() => {
    // Fetch users
    fetch(`${API_BASE}/users/users`)
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error)

    // Fetch posts
    fetch(`${API_BASE}/posts/posts`)
      .then(res => res.json())
      .then(setPosts)
      .catch(console.error)

    // Fetch comments
    fetch(`${API_BASE}/comments/comments`)
      .then(res => res.json())
      .then(setComments)
      .catch(console.error)
  }, [])

  return (
    <div className="App">
      <h1>ChillEco Microservices</h1>
      
      <div className="services">
        <div className="service">
          <h2>Users</h2>
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>

        <div className="service">
          <h2>Posts</h2>
          <ul>
            {posts.map(post => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>

        <div className="service">
          <h2>Comments</h2>
          <ul>
            {comments.map(comment => (
              <li key={comment.id}>{comment.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App