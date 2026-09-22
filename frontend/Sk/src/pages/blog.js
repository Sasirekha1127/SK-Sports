import { Link } from "react-router-dom"
import Layout from "../components/layout/Layout"
import { useState, useEffect } from "react"

export default function Blog() {
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 10;

	const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
	const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL || '/api'}/blogs`)
			.then(r => r.json())
			.then(data => {
				if (data.success) {
					// map the db keys to match expected frontend format
					const publishedPosts = data.data.filter(item => item.status === 'published' || !item.status);
					const mappedPosts = publishedPosts.map(item => ({
						id: item.id,
						img: (item.image_url && item.image_url.length > 5) ? item.image_url : "images/blog/post-widget2.jpg",
						tag: item.tag,
						title: item.title,
						author: item.author,
						date: item.publish_date ? new Date(item.publish_date).toLocaleDateString() : '',
						comments: item.comments_count,
						content: item.content
					}));
					setPosts(mappedPosts);
				}
			})
			.catch(console.error);
	}, []);

	return (
		<>

			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div>
					<div className="page-title">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12">
									<div className="page-title-heading">
										<h1 className="title">latest news</h1>
									</div>{/* /.page-title-captions */}
									<div className="breadcrumbs">
										<ul>
											<li><Link to="/">Homepage</Link></li>
											<li> <i className="icon-Arrow---Right-2" /></li>
											<li><a>Latest News</a></li>
										</ul>
									</div>{/* /.breadcrumbs */}
								</div>{/* /.col-md-12 */}
							</div>{/* /.row */}
						</div>{/* /.container */}
					</div>{/* /.page-title */}

					{/* Blog Posts - Grid Card Layout */}
					<section className="main-content blog-posts blog-posts-grid">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12 col-lg-12 col-xl-12 col-xxl-12 widget-blog-content">
									<div className="row">
										{currentPosts.map((post, index) => (
											<div className="col-md-6 col-lg-4" key={index}>
												<article className="entry format-standard wow fadeInUp animated blog-card">
													<div className="feature-post blog-card-thumb">
														<Link to="/blog-single" state={post}>
															<img src={post.img} alt="image" />
														</Link>
														<div className="tag blog-card-tag">
															<ul>
																<li>
																	<Link to="/blog-single" state={post}>{post.tag}</Link>
																</li>
															</ul>
														</div>
													</div>{/* /.feature-post */}
													<div className="main-post blog-card-body">
														<div className="entry-meta">
															<span className="author line"><Link to="/blog-single" state={post}>{post.author}</Link></span>
															<span className="date line"><Link to="/blog-single" state={post}>{post.date}</Link></span>
														</div>
														<h2 className="entry-title">
															<Link to="/blog-single" state={post}>{post.title}</Link>
														</h2>
														<div className="entry-meta blog-card-footer">
															<Link className="more-link" to="/blog-single" state={post}>Read More</Link>
														</div>
													</div>{/* /.main-post */}
												</article>
											</div>
										))}
									</div>

									{totalPages > 1 && (
										<div className="blog-pagination wow fadeInUp animated" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
											<ul className="flat-pagination clearfix" style={{ display: 'flex', gap: '5px' }}>
												<li>
													<button
														onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
														disabled={currentPage === 1}
														style={{ background: 'transparent', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, padding: '10px 15px', fontWeight: 'bold' }}
													>
														Prev
													</button>
												</li>
												{[...Array(totalPages)].map((_, i) => (
													<li key={i} className={currentPage === i + 1 ? 'active' : ''}>
														<button
															onClick={() => setCurrentPage(i + 1)}
															style={{
																border: 'none',
																background: currentPage === i + 1 ? '#ccff00' : 'transparent',
																color: currentPage === i + 1 ? '#111' : 'inherit',
																width: '40px', height: '40px',
																display: 'flex', justifyContent: 'center', alignItems: 'center',
																fontWeight: 'bold',
																cursor: 'pointer'
															}}
														>
															{i + 1}
														</button>
													</li>
												))}
												<li>
													<button
														onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
														disabled={currentPage === totalPages}
														style={{ background: 'transparent', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, padding: '10px 15px', fontWeight: 'bold' }}
													>
														Next
													</button>
												</li>
											</ul>
										</div>
									)}
								</div>
							</div>{/* /.row */}
						</div>{/* /.container */}
					</section>
				</div>

			</Layout>
		</>
	)
}
