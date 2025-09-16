
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import './Post.css';
function Post() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [posts, setPosts] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc"); // Renamed for consistency

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setAuthLoading(false);
        });
        // クリーンアップ関数
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const postsCol = collection(db, "posts");
                const q = query(postsCol, orderBy("createdAt", "desc"));
                const postsSnapshot = await getDocs(q);
                const postsList = postsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPosts(postsList);
            } catch (err) {
                setError("投稿の取得に失敗しました");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);
    const handleAddPost = async () => {
        if (!title.trim() || !content.trim()) {
            setError("タイトルと内容を入力してください");
            return;
        }
        const user = currentUser;
        if (!user) {
            setError("ログインが必要です。");
            navigate("/");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const docRef = await addDoc(collection(db, "posts"), {
                title: title,
                content: content,
                createdAt: serverTimestamp(),
                authorId: user.uid,
                authorName: user.displayName,
                authorPhotoURL: user.photoURL,
                likes: [],
                likeCount: 0,
                // 通常投稿はリツイートではない
                isRetweet: false, 
                retweets: [],
                retweetCount: 0,
            });
            const newPost = { id: docRef.id, title, content, createdAt: { seconds: Date.now() / 1000 },
                authorId: user.uid,
                authorName: user.displayName,
                authorPhotoURL: user.photoURL,
                likes: [],
                isRetweet: false,
                likeCount: 0,
                retweets: [],
                retweetCount: 0,
            };
            setPosts((prevPosts) => [newPost, ...prevPosts]);
            setTitle("");
            setContent("");
        } catch (err) {
            setError("投稿の追加に失敗しました");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => {
            const dateA = a.createdAt?.seconds || 0;
            const dateB = b.createdAt?.seconds || 0;
            if (sortOrder === "asc") {
                return dateA - dateB;
            }
            return dateB - dateA; // desc is the default
        });
    }, [posts, sortOrder]);

    const handleLike = async (postId, currentLikes) => {
        const user = currentUser;
        if (!user) {
            setError("いいねするにはログインが必要です。");
            return;
        }
        const userId = user.uid;
        const postRef = doc(db, "posts", postId);
        const isLiked = currentLikes?.includes(userId);

        try {
            if (isLiked) {
                // いいねを取り消す
                await updateDoc(postRef, {
                    likes: arrayRemove(userId),
                    likeCount: increment(-1),
                });
            } else {
                // いいねする
                await updateDoc(postRef, {
                    likes: arrayUnion(userId),
                    likeCount: increment(1),
                });
            }

            // UIを即時更新
            setPosts(posts.map(p =>
                p.id === postId ? { ...p, likeCount: (p.likeCount || 0) + (isLiked ? -1 : 1), likes: isLiked ? (p.likes || []).filter(uid => uid !== userId) : [...(p.likes || []), userId] } : p
            ));
        } catch (err) {
            setError("いいねの処理に失敗しました。");
            console.error(err);
        }
    };

    const handleRetweet = async (postToRetweet) => {
        const user = currentUser;
        if (!user) {
            setError("リツイートするにはログインが必要です。");
            return;
        }

        // リツイート済みの投稿はリツイートできないようにする
        if (postToRetweet.isRetweet) {
            console.log("リツイート投稿はリツイートできません。");
            return;
        }

        // 自分の投稿はリツイートできないようにする（任意）
        if (postToRetweet.authorId === user.uid) {
            setError("自分の投稿はリツイートできません。");
            return;
        }

        // 既にリツイート済みかチェック
        if (postToRetweet.retweets?.includes(user.uid)) {
            // 今回は簡単化のため、取り消しは実装せずアラートのみ
            alert("この投稿はすでにリツイートしています。");
            return;
        }

        // 元の投稿への参照とリツイート情報を加えて新しい投稿を作成
        try {
            const originalPostRef = doc(db, "posts", postToRetweet.id);

            // 新しい投稿としてリツイートを保存
            const docRef = await addDoc(collection(db, "posts"), {
                isRetweet: true,
                originalPostId: postToRetweet.id,
                originalAuthorId: postToRetweet.authorId,
                originalAuthorName: postToRetweet.authorName,
                originalAuthorPhotoURL: postToRetweet.authorPhotoURL,
                originalTitle: postToRetweet.title,
                originalContent: postToRetweet.content,
                originalCreatedAt: postToRetweet.createdAt,
                retweetedBy: user.uid,
                retweetedByDisplayName: user.displayName,
                createdAt: serverTimestamp(),
                likes: [],
                likeCount: 0,
            });

            // 元の投稿のリツイート情報を更新
            await updateDoc(originalPostRef, {
                retweets: arrayUnion(user.uid),
                retweetCount: increment(1),
            });

            // UIを即時更新
            // 新しいリツイート投稿をタイムラインの先頭に追加し、元の投稿のカウントも更新
            const newRetweetPost = { id: docRef.id, isRetweet: true, ...postToRetweet, originalCreatedAt: postToRetweet.createdAt, createdAt: { seconds: Date.now() / 1000 }, retweetedByDisplayName: user.displayName };
            setPosts(prevPosts => [newRetweetPost, ...prevPosts.map(p => p.id === postToRetweet.id ? { ...p, retweetCount: (p.retweetCount || 0) + 1, retweets: [...(p.retweets || []), user.uid] } : p)]);
        } catch (err) {
            setError("リツイートの処理に失敗しました。");
            console.error(err);
        }
    };

    const autoResizeTextarea = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    if (authLoading) {
        return <div className="loading-fullscreen">読み込み中...</div>; // または適切なローディングスピナー
    }

    return (
        <div className="home-container">
            <div className="sidebar">
                <div className="profile-summary">
                    <div
                        className="sidebar-avatar"
                        style={currentUser?.photoURL ? { backgroundImage: `url(${currentUser.photoURL})` } : {}}
                        role="img"
                        aria-label="User Avatar"
                    />
                    <h4>{currentUser?.displayName || 'ユーザー名'}</h4>
                </div>
                <button className="sidebar-button" onClick={() => navigate("/home")}>ホーム</button>
                <button className="sidebar-button" onClick={() => navigate("/stopwatch")}>ストップウォッチ</button>
                <button className="sidebar-button active" onClick={() => navigate("/post")}>投稿</button>
                <button className="sidebar-button" onClick={() => navigate("/profile")}>プロフィール</button>
                <button className="sidebar-button logout-button" onClick={() => navigate("/")}>ログアウト</button>
            </div>
            <div className="main-content">
                <div className="post-list-container">
                    <div className="post-list-header">
                        <h3>みんなの投稿</h3>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="desc">新しい順</option>
                            <option value="asc">古い順</option>
                        </select>
                    </div>
                    {loading && posts.length === 0 && <p>読み込み中...</p>}
                    <ul>
                        {sortedPosts.map((post) => {
                            const isLiked = post.likes?.includes(currentUser?.uid);
                            
                            if (post.isRetweet) {
                                // リツイート投稿の表示
                                return (
                                    <li key={post.id + '-retweet'} className="post-item retweet-item">
                                        <div className="retweet-header">
                                            🔁 {post.retweetedByDisplayName}さんがリツイートしました
                                        </div>
                                        <div className="original-post-container">
                                            <div className="post-avatar">
                                                <div
                                                    className="avatar-icon"
                                                    style={post.originalAuthorPhotoURL ? { backgroundImage: `url(${post.originalAuthorPhotoURL})` } : {}}
                                                    role="img"
                                                    aria-label={post.originalAuthorName || 'avatar'}
                                                />
                                            </div>
                                            <div className="post-content-container">
                                                <span className="post-author-name">{post.originalAuthorName || '匿名ユーザー'}</span>
                                                <h3>{post.originalTitle || post.title}</h3>
                                                <p>{post.originalContent || post.content}</p>
                                                {/* リツイートされた投稿に対してもいいねができるようにする */}
                                                <div className="post-actions">
                                                    <button onClick={() => handleLike(post.id, post.likes)} className={`like-button ${isLiked ? 'liked' : ''}`}>❤️</button>
                                                    <span className="like-count">{post.likeCount || 0}</span>
                                                    {/* リツイート投稿にはリツイート関連のボタンは表示しない */}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            } else {
                                // 通常の投稿の表示
                                const isRetweeted = post.retweets?.includes(currentUser?.uid);
                                return (
                                    <li key={post.id} className="post-item">
                                        <div className="post-avatar">
                                            <div className="avatar-icon" style={post.authorPhotoURL ? { backgroundImage: `url(${post.authorPhotoURL})` } : {}} role="img" aria-label={post.authorName || 'avatar'}/>
                                        </div>
                                        <div className="post-content-container">
                                            <span className="post-author-name">{post.authorName || '匿名ユーザー'}</span>
                                            <h3>{post.title}</h3>
                                            <p>{post.content}</p>
                                            <div className="post-actions">
                                                <button onClick={() => handleLike(post.id, post.likes)} className={`like-button ${isLiked ? 'liked' : ''}`}>❤️</button>
                                                <span className="like-count">{post.likeCount || 0}</span>
                                                <button onClick={() => handleRetweet(post)} className={`retweet-button ${isRetweeted ? 'retweeted' : ''}`}>🔁</button>
                                                <span className="retweet-count">{post.retweetCount || 0}</span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }
                        })}
                    </ul>
                </div>
                <div className="post-form-container">
                    <div className="post-form">
                         <div
                            className="sidebar-avatar"
                            style={currentUser?.photoURL ? { backgroundImage: `url(${currentUser.photoURL})` } : {}}
                            role="img"
                            aria-label="User Avatar"
                        />
                        <div className="input-wrapper">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="タイトル"
                            />
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onInput={autoResizeTextarea}
                                placeholder="私の時短術は..."
                                rows="1"
                            ></textarea>
                        </div>
                        <button className="submit-post-button" onClick={handleAddPost} disabled={loading || !content.trim()}>
                            {loading ? "..." : "➤"}
                        </button>
                    </div>
                    {error && <p className="post-form-error">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default Post;