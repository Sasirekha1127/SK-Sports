import { Link } from "react-router-dom"

const posts = [
	{
		img: "images/blog/blog1.jpg",
		tag: "Training",
		title: "Mastering the Smash: Advanced Techniques for Badminton Players",
		author: "Coach Ravi",
		date: "Oct 12, 2024",
		comments: "04",
	},
	{
		img: "images/blog/blog2.png",
		tag: "Gear",
		title: "Choosing the Right Racket: A Complete Guide for Beginners",
		author: "SK Sports Team",
		date: "Oct 15, 2024",
		comments: "07",
	},
	{
		img: "images/blog/blog3.png",
		tag: "Health & Fitness",
		title: "Nutrition Strategies for Peak Performance on the Court",
		author: "Dr. Ananya",
		date: "Oct 20, 2024",
		comments: "02",
	},
]

export default function Course1() {
	return (
		<>
			<div className="tf-widget-course main-content blog-posts-grid">
				<div className="themeflat-container">
					<div className="tf-course">
						{/* header style v1 */}
						<div className="title-box center-title-box title-large">
							<span className="sub-title wow fadeInUp animated">Blog Articles</span>
							<h2 className="title-section wow fadeInUp animated">Latest News, Articles &amp; Tips<br /> from the Court</h2>
						</div>{/* header style v1 */}
						<div className="row">
							{posts.map((post, index) => (
								<div className="col-md-6 col-lg-4" key={index}>
									<article className="entry format-standard wow fadeInUp animated blog-card" data-wow-delay={`${0.3 * index}s`}>
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
					</div>
				</div>
			</div>
		</>
	)
}
