import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Flag, Plus, Search, Users, AlertTriangle, ShieldAlert, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TOPICS = ["All", "Academic Stress", "Self-Care", "Relationships", "Career Anxiety"];

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [topic, setTopic] = useState("All");
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isCounselor = user?.role === 'counsellor' || user?.role === 'admin';

  useEffect(() => {
    loadPosts();
  }, [topic]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const endpoint = topic === "All" ? "/community/posts" : `/community/posts?topic=${encodeURIComponent(topic)}`;
      const res = await api.get(endpoint);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setIsPosting(true);
    try {
      await api.post('/community/posts', {
        topic: topic === "All" ? "Academic Stress" : topic, // Default topic if all selected
        content: newPost
      });
      setNewPost("");
      loadPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleFlag = async (id) => {
    try {
      await api.post(`/community/posts/${id}/flag`);
      loadPosts(); // reload to reflect UI (e.g. might hide it if flagged or show warning)
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/community/posts/${id}`);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="font-display text-2xl text-slate-100 flex items-center gap-2">
          <Users className="text-cyan-400" />
          Peer Support Community
        </h1>
        <p className="mt-2 text-slate-400">A safe, anonymous space to share your thoughts and find support.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TOPICS.map(t => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm transition ${
              topic === t 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' 
                : 'bg-glass-ultra text-slate-400 border border-border-glass hover:bg-glass-medium'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="glass neo-border rounded-3xl p-5">
        <div className="flex gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <span className="text-cyan-300 text-sm font-bold">You</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={`Share what's on your mind... ${topic !== 'All' ? `(${topic})` : ''}`}
              className="textarea w-full text-sm min-h-[80px]"
            />
            <div className="mt-3 flex justify-end">
              <button 
                onClick={handlePost} 
                disabled={isPosting || !newPost.trim()}
                className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
              >
                {isPosting ? 'Posting...' : <><Plus size={16} /> Post Anonymously</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-3xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <MessageSquare className="mx-auto mb-3 opacity-50" size={32} />
            <p>No posts yet in this topic. Be the first to share!</p>
          </div>
        ) : (
          posts.map(post => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass neo-border rounded-3xl p-5 ${post.flagged ? 'border-rose-500/30 bg-rose-500/5' : ''}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <span className="text-slate-400 text-xs font-bold">{post.author_alias.substring(0,2)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{post.author_alias}</p>
                    <p className="text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString()} • {post.topic}</p>
                  </div>
                </div>
                {!post.flagged && (
                  <button onClick={() => handleFlag(post.id)} className="text-slate-500 hover:text-rose-400 transition" title="Report post">
                    <Flag size={14} />
                  </button>
                )}
              </div>
              
              {post.flagged ? (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-rose-400/80 text-sm italic">
                    <ShieldAlert size={16} />
                    This post has been flagged for review and hidden.
                  </div>
                  {isCounselor && (
                    <button onClick={() => handleRemove(post.id)} className="btn-icon text-rose-500 bg-rose-500/10 hover:bg-rose-500/20" title="Remove Post">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-slate-300 text-sm whitespace-pre-wrap">{post.content}</p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityPage;
