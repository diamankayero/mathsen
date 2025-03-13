import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
}

export default function Forum() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetchReplies(selectedPost.id);
    }
  }, [selectedPost]);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
    }
  }

  async function fetchReplies(postId: string) {
    const { data, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching replies:', error);
    } else {
      setReplies(data);
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('forum_posts').insert([
      {
        title: newPost.title,
        content: newPost.content,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error('Error creating post:', error);
    } else {
      setNewPost({ title: '', content: '' });
      fetchPosts();
    }
  }

  async function handleCreateReply(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedPost) return;

    const { error } = await supabase.from('forum_replies').insert([
      {
        content: newReply,
        post_id: selectedPost.id,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error('Error creating reply:', error);
    } else {
      setNewReply('');
      fetchReplies(selectedPost.id);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Forum</h1>

      {!selectedPost ? (
        <>
          {user && (
            <form onSubmit={handleCreatePost} className="mb-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Créer une nouvelle discussion</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Contenu
                  </label>
                  <textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Publier
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedPost(post)}
              >
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <p className="text-sm text-gray-500">
                  
                  Publié le {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← Retour aux discussions
          </button>
          
          <h2 className="text-2xl font-semibold mb-4">{selectedPost.title}</h2>
          <p className="text-gray-600 mb-8">{selectedPost.content}</p>

          <div className="space-y-4 mb-8">
            {replies.map((reply) => (
              <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 mb-2">{reply.content}</p>
                <p className="text-sm text-gray-500">
                  Répondu le {new Date(reply.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {user && (
            <form onSubmit={handleCreateReply}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="reply" className="block text-sm font-medium text-gray-700">
                    Votre réponse
                  </label>
                  <textarea
                    id="reply"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Répondre
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}