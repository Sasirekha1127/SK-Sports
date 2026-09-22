

import { Link, useLocation } from "react-router-dom"
import Layout from "../components/layout/Layout"
export default function BlogSingle() {
	const location = useLocation();
	const post = location.state || {
		img: "images/blog/blog-details.jpg",
		tag: "Training",
		title: "Mastering the Smash: Advanced Techniques for Badminton Players",
		author: "Coach Ravi",
		date: "Oct 12, 2024",
		comments: "04"
	};

	return (
		<>

			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div>
					<div className="page-title page-title-blog text-left">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12">
									<div className="page-title-heading">
										<h1 className="title">Blog detail</h1>
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
					{/* Blog Posts */}
					<section className="main-content blog-content-single">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12 col-lg-12 col-xl-12 col-xxl-12 widget-blog-content">
									<div className="post-wrap wow fadeInUp animated">
										<article className="entry format-standard">
											<div className="main-post">
												<div className="tag">
													<ul>
														<li>
															<Link to="/#">{post.tag}</Link>
														</li>
													</ul>
												</div>
												<h2 className="entry-title-single">
													{post.title}
												</h2>
												<div className="entry-meta">
													<span className="author line"><img src="images/blog/Avatar.png" alt="" /><Link to="/#">by
														{post.author} </Link></span>
													<span className="date line"><Link to="/#">{post.date}</Link></span>
												</div>{/* /.entry-meta */}
												<div className="entry-content">
													{post.content ? (
														<p className="post">{post.content}</p>
													) : (
														<p className="post">Welcome to the latest guide by {post.author} on our definitive series about {post.tag}. Whether you are just starting out on the court or looking to hone your skills for your next competitive tournament, understanding the biomechanical foundations of your swing, footwork, and strategy is essential. In this deep dive, we break down exactly how you can elevate your game.</p>
													)}
												</div>{/* /.entry-post */}
												<div className="feature-post">
													<div className="entry-image">
														<img src={post.img || "images/blog/blog-details.jpg"} alt="image" style={{ width: '100%' }} />
													</div>{/* /.entry-image */}
												</div>{/* /.feature-post */}

											</div>{/* /.main-post */}
										</article>

									</div>{/* /.post-wrap */}
								</div>{/* /.col-md-9 */}

							</div>{/* /.row */}

						</div>{/* /.container */}
					</section>
				</div>

			</Layout>
		</>
	)
}