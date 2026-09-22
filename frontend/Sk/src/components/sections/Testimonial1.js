

import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useState, useEffect } from "react"

const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	slidesPerView: 1,
	spaceBetween: 30,
	autoplay: {
		delay: 2500,
		disableOnInteraction: false,
	},
	loop: true,

	// Navigation
	navigation: {
		nextEl: '.h1n',
		prevEl: '.h1p',
	},

	// Pagination
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	}
}

export default function Testimonial1() {
	const [testimonials, setTestimonials] = useState([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const apiUrl = process.env.REACT_APP_API_URL || '/api';

	useEffect(() => {
		fetch(`${apiUrl}/testimonials`)
			.then(r => r.json())
			.then(data => {
				const items = Array.isArray(data) ? data : (data.data || []);
				const published = items.filter(item => item.status === 'published' || !item.status);
				if (published.length > 0) {
					setTestimonials(published);
				}
			})
			.catch(console.error);
	}, [apiUrl]);

	// Fallback to static if none loaded
	const displayData = testimonials.length > 0 ? testimonials : [
		{ name: "Jane Nguyen", role: "Academy Student", quote: "Joining this academy was the best decision! The coaches are incredible and my badminton skills have improved massively.", image: "/images/testimonial/images.png" },
		{ name: "Jane Nguyen", role: "Academy Student", quote: "I've always struggled with staying consistent with exercise, but being part of the Badminton Academy has changed that", image: "/images/testimonial/images.png" }
	];

	const resolveImg = (src) => {
		if (!src || src.length <= 5) return '/images/testimonial/images.png';
		if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
		return src.startsWith('/') ? src : `/${src}`;
	};

	// Get currently active images safely
	const activeTestimonial = displayData[activeIndex] || displayData[0];
	const img1 = activeTestimonial?.side_image_1 || "images/testimonial/image.jpg";
	const img2 = activeTestimonial?.side_image_2 || "images/testimonial/image.jpg";

	return (
		<>

			<div className="tf-widget-testimonial background-black">
				<div className="themeflat-container">
					<div className="tf-testimonial">
						<div className="row">
							<div className="col-md-12 col-lg-7 col-xl-7 col-xxl-7">
								<div className="wow fadeInLeft animated">
									<Swiper {...swiperOptions} onSlideChange={(s) => setActiveIndex(s.realIndex)} className="swiper-testimonial owl-theme" style={{ paddingBottom: '20px' }}>
										{displayData.map((item, index) => (
											<SwiperSlide key={index}>
												<div className="tf-testimonial-content">
													<div className="user-info">
														<img className="icon-testimonil" src="images/testimonial/Graphic.png" alt="" />
														<div className="avata">
															<img
																src={resolveImg(item.image)}
																alt={item.name || ""}
																onError={(e) => {
																	if (!e.currentTarget.dataset.fallback) {
																		e.currentTarget.dataset.fallback = 'true';
																		e.currentTarget.src = '/images/testimonial/images.png';
																	}
																}}
															/>
														</div>
														<div className="info">
															<h6 className="name">{item.name}</h6>
															<p className="post">{item.role}</p>
														</div>
													</div>
													<div className="content">
														<p className="description" style={{ marginTop: '20px' }}>"{item.quote}"</p>
													</div>
												</div>
											</SwiperSlide>
										))}

										<div className="owl-controls">
											<div className="owl-nav">
												<div className="owl-prev h1p">prev</div>
												<div className="owl-next h1n">next</div>
											</div>
										</div>
									</Swiper>

								</div>
							</div>
							<div className="col-md-12 col-lg-5 col-xl-5 col-xxl-5">
								<div className="testimonial-wrap">
									<div className="testimonial-box wow fadeInUp animated" style={{ padding: 0, overflow: 'hidden', background: 'transparent', boxShadow: 'none', border: 'none' }}>
										<img src={img1} alt="testimonial" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '8px', transition: 'all 0.4s ease' }} />
									</div>
									<div className="testimonial-box wow fadeInUp animated" style={{ padding: 0, overflow: 'hidden', background: 'transparent', boxShadow: 'none', border: 'none' }}>
										<img src={img2} alt="testimonial" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '8px', transition: 'all 0.4s ease' }} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
