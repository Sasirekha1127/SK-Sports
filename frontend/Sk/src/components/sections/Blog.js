import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
    const [blogs, setBlogs] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        fetch(`${apiUrl}/blogs`)
            .then(r => r.json())
            .then(data => {
                if (data.success && data.data) {
                    const featuredBlogs = data.data.filter(item =>
                        (item.status === 'published' || !item.status) &&
                        (item.featured === 1 || item.featured === true)
                    );
                    const mappedBlogs = featuredBlogs.map(item => ({
                        id: item.id,
                        img: (item.image_url && item.image_url.length > 5) ? item.image_url : "images/blog/post-widget2.jpg",
                        tag: item.tag,
                        title: item.title,
                        author: item.author,
                        date: item.publish_date ? new Date(item.publish_date).toLocaleDateString() : '',
                        comments: item.comments_count,
                        content: item.content
                    }));

                    // Only show explicitly featured blogs
                    setBlogs(mappedBlogs.slice(0, 3));
                }
            })
            .catch(console.error);
    }, [apiUrl]);

    if (blogs.length === 0) return null; // Hide completely if none featured

    return (
        <>
            <div className="tf-widget-course main-content blog-posts-grid">
                <div className="themeflat-container">
                    <div className="tf-course">
                        <div className="title-box center-title-box title-large">
                            <span className="sub-title wow fadeInUp animated">Blog Articles</span>
                            <h2 className="title-section wow fadeInUp animated">Latest News, Articles &amp; Tips<br /> from the Court</h2>
                        </div>
                        <div className="row">
                            {blogs.map((post, index) => (
                                <div className="col-md-6 col-lg-4" key={index}>
                                    <article className="entry format-standard wow fadeInUp animated blog-card" style={{ marginBottom: '30px' }}>
                                        <div className="feature-post blog-card-thumb" style={{ position: 'relative' }}>
                                            <Link to="/blog-single" state={post}>
                                                <img src={post.img} alt="image" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
                                            </Link>
                                            <div className="tag blog-   card-tag" style={{ position: 'absolute', bottom: '15px', left: '15px', background: '#111', padding: '4px 12px', zIndex: 2 }}>
                                                <ul style={{ margin: 0, padding: 0 }}>
                                                    <li style={{ listStyle: 'none' }}>
                                                        <Link to="/blog-single" state={post} style={{ color: '#ccff00', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{post.tag}</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="main-post blog-card-body" style={{ padding: '20px 0' }}>
                                            <div className="entry-meta" style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', marginBottom: '10px', alignItems: 'center' }}>
                                                <span className="author line"><Link to="/blog-single" state={post} style={{ color: 'inherit' }}>{post.author}</Link></span>
                                                <span>�</span>
                                                <span className="date line"><Link to="/blog-single" state={post} style={{ color: 'inherit' }}>{post.date}</Link></span>
                                            </div>
                                            <h2 className="entry-title" style={{ fontSize: '18px', fontWeight: 600, lineHeight: '1.4', margin: '0' }}>
                                                <Link to="/blog-single" state={post} style={{ color: '#111' }}>{post.title}</Link>
                                            </h2>
                                            <div className="entry-meta blog-card-footer" style={{ marginTop: '15px' }}>
                                                <Link className="more-link" to="/blog-single" state={post}>Read More</Link>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
