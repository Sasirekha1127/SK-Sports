

import { useState, useEffect } from "react"
import CountUp from 'react-countup'
import { Link } from "react-router-dom"
import Layout from "../components/layout/Layout"
export default function About() {
	const [isTab, setIsTab] = useState(1)
	const [counters, setCounters] = useState([])
	const [teamMembers, setTeamMembers] = useState([])
	const [activeAbout, setActiveAbout] = useState(null)
	const [aboutData, setAboutData] = useState(null)
	const apiUrl = process.env.REACT_APP_API_URL || '/api'

	useEffect(() => {
		fetch(`${apiUrl}/about`)
			.then(r => r.json())
			.then(data => {
				if (data && Object.keys(data).length > 0) {
					setAboutData(data);
				}
			})
			.catch(console.error);

		fetch(`${apiUrl}/settings`)
			.then(r => r.json())
			.then(data => {
				if (data.homepage_data) {
					const hp = JSON.parse(data.homepage_data);
					if (hp.counters) setCounters(hp.counters);
				}
			})
			.catch(console.error);

		fetch(`${apiUrl}/team`)
			.then(r => r.json())
			.then(data => {
				const items = Array.isArray(data) ? data : (data.data || []);
				const active = items.filter(item => item.status === 'active' || !item.status);
				if (active.length > 0) setTeamMembers(active);
			})
			.catch(console.error);
	}, [apiUrl]);

	const handleTab = (i) => {
		setIsTab(i)
	}

	return (
		<>

			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div>
					<div className="page-title">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12">
									<div className="page-title-heading">
										<h1 className="title">About Us</h1>
									</div>{/* /.page-title-captions */}
									<div className="breadcrumbs">
										<ul>
											<li><Link to="/">Homepage</Link></li>
											<li><i className="icon-Arrow---Right-2" /></li>
											<li><a>About Us</a></li>
										</ul>
									</div>{/* /.breadcrumbs */}
								</div>{/* /.col-md-12 */}
							</div>{/* /.row */}
						</div>{/* /.container */}
					</div>

					<div className="tf-widget-about-us main-content">
						<div className="themeflat-container">
							<div className="tf-about-us">
								<div className="row">
									<div className="col-lg-6 col-12 image-wraper">
										<div className="media">
											<div className="media-v1 wow fadeInLeft animated">
												<img className="mask-media about-main-img" src={aboutData?.image || "images/about/badminton-court.png"} alt="SK Sports Academy" />
											</div>
										</div>
									</div>
									<div className="col-lg-6 col-12">
										<div className="about-box">
											{/* header style v1 */}
											<div className="title-box title-small-v2">
												<span className="sub-title wow fadeInUp animated">{aboutData?.subtitle || "Welcome to SK Sports!"}</span>
												<h2 className="title-section wow fadeInUp animated">{aboutData?.title || "SK Sports - Your Ultimate Badminton Academy"}
												</h2>
											</div>{/* header style v1 */}
											{(aboutData?.body
												? aboutData.body.split(/\n+/).filter(Boolean)
												: [
													"Join our passionate badminton community, where we offer top-tier coaching, organize competitive tournaments, and help you master every aspect of the sport.",
													"SK Sports Academy was founded with a singular vision: to nurture and elevate the incredible sport of badminton across the region. We provide an electrifying environment for players of all skill levels, from absolute beginners to seasoned state-level professionals.",
													"Beyond just training, we organize highly competitive local and state tournaments that give you the perfect platform to showcase your talent, build true sportsmanship, and forge lifelong friendships. Come be a part of the SK Sports family and unlock your true athletic potential!"
												]
											).map((para, idx, arr) => (
												<p key={idx} className="post wow fadeInUp animated" style={{ marginBottom: idx < arr.length - 1 ? "15px" : "0" }}>
													{para}
												</p>
											))}
											<div className="line" />
											<div className="about-button-group">
												<div className="infor-about">
													<img src="images/about/info.png" alt="" />
													<div className="info">
														<div className="name wow fadeInUp animated">Founder</div>
														<div className="job wow fadeInUp animated">SK Sports Academy</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>{/* Widget-about  */}
					{/* Widget-counter */}
					<div className="tf-wiget-counter background-surface main-content-medium">
						<div className="themeflat-container">
							<div className="tf-counter">
								<div className="row" style={{ justifyContent: 'center' }}>
									{(counters.length > 0 ? counters : [
										{ label: 'Tournament Awards', value: 196 },
										{ label: 'Active Members', value: 2432 },
										{ label: 'Competitions', value: 244 },
										{ label: 'Expert Coaches', value: 85 }
									]).map((c, i) => (
										<div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 col-xxl-3" key={i} style={{ marginBottom: '20px' }}>
											<div className="flat-counter wow fadeInUp animated text-center" data-wow-delay={`${0.1 * (i + 1)}s`}>
												{c.icon ? (
													<img
														src={c.icon}
														alt={c.label || ''}
														style={{ width: '64px', height: '64px', objectFit: 'contain', marginBottom: '12px', display: 'block', margin: '0 auto 12px auto' }}
													/>
												) : (
													<svg width={81} height={80} viewBox="0 0 81 80" fill="none" xmlns="http://www.w3.org/2000/svg">
														<g clipPath="url(#clip0_6720_9459)">
															<path d="M20.013 26.0492C20.013 25.1793 20.7181 24.474 21.5882 24.474C22.4582 24.474 23.1633 25.1792 23.1633 26.0492C23.1633 26.9192 22.4582 27.6243 21.5882 27.6243C20.7181 27.6243 20.013 26.919 20.013 26.0492ZM68.5794 47.1113L51.0183 45.5159L46.1367 59.2104H54.8172C55.6869 59.2104 56.3922 59.9156 56.3922 60.7853V65.5103H59.5422C60.4119 65.5103 61.1172 66.2156 61.1172 67.0853V76.8502H61.9047C62.7744 76.8502 63.4796 77.5555 63.4796 78.4252C63.4796 79.2949 62.7744 80.0002 61.9047 80.0002H19.38C18.5103 80.0002 17.805 79.2949 17.805 78.4252C17.805 77.5555 18.5103 76.8502 19.38 76.8502H20.1675V67.0853C20.1675 66.2156 20.8728 65.5103 21.7425 65.5103H24.8925V60.7853C24.8925 59.9156 25.5978 59.2104 26.4675 59.2104H35.4907L29.493 40.8035L11.1616 33.5964C10.163 33.3044 9.65575 31.6582 10.9112 30.7897L14.7289 28.432C14.7305 28.432 14.7322 28.432 14.7322 28.4302C16.4865 27.3498 18.1385 30.032 16.3842 31.1124L15.2441 31.8165L31.3373 38.1433C31.7752 38.3166 32.1122 38.6724 32.2587 39.1214L38.8046 59.2104H42.7931L48.4604 43.3076C48.7 42.6366 49.3756 42.2035 50.0874 42.2681L65.7601 43.6919L56.8882 29.0445C56.6393 28.6334 56.5938 28.12 56.7637 27.6697L62.9741 11.3149L46.709 15.8463C46.2239 15.9801 45.6837 15.8683 45.2933 15.5502L31.9799 4.72041L30.9499 21.3349C30.9345 21.5865 30.8589 21.8306 30.7296 22.0469C30.6002 22.2632 30.4208 22.4452 30.2065 22.5778L28.4455 23.6659C26.6596 24.7687 25.0043 22.0881 26.7902 20.9853L27.8564 20.3269L29.0252 1.46806C29.1194 0.30572 30.5369 -0.486813 31.5909 0.34352L46.6492 12.5922L65.1301 7.44513C66.5075 7.14935 67.4831 8.36855 67.0248 9.52238L59.9814 28.0694L70.0692 44.728C70.8058 45.7417 69.8914 47.2049 68.5794 47.1113ZM29.9324 68.6603H23.3175V76.8502H29.9324V68.6603ZM48.2023 68.6603H33.0824V76.8502H48.2023V68.6603ZM51.3522 68.6603V76.8502H57.9672V68.6603H51.3522ZM53.2422 62.3603H28.0425V65.5103H53.2422V62.3603Z" fill="#5E6267" />
														</g>
														<defs>
															<clipPath id="clip0_6720_9459">
																<rect width={80} height={80} fill="white" transform="translate(0.25)" />
															</clipPath>
														</defs>
													</svg>
												)}
												<div className="content-counter">
													<CountUp className="numb-count" enableScrollSpy={true} end={Number(c.value) || 0} data-speed={2000} data-waypoint-active="yes">{Number(c.value) || 0}</CountUp>
													<div className="name-count">{c.label}</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>{/* Widget-counter */}
					{/* Widget-mission */}
					<style>{`
						.image-mission-wrap {
							position: relative !important;
							max-width: 540px !important;
							margin: 0 auto 30px auto !important;
							padding-right: 90px !important;
							padding-bottom: 50px !important;
						}
						.image-mission-wrap .image-v1,
						.image-mission-wrap img.image-v1 {
							width: 100% !important;
							max-width: 440px !important;
							height: 380px !important;
							object-fit: cover !important;
							border-radius: 20px !important;
							display: block !important;
							box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
						}
						.image-mission-wrap .image-v2,
						.image-mission-wrap img.image-v2 {
							position: absolute !important;
							bottom: 0 !important;
							right: 15px !important;
							width: 250px !important;
							max-width: 55% !important;
							height: 270px !important;
							object-fit: cover !important;
							border-radius: 18px !important;
							border: 8px solid #ffffff !important;
							box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18) !important;
							z-index: 2 !important;
							display: block !important;
						}
						@media (max-width: 768px) {
							.image-mission-wrap {
								padding-right: 0 !important;
								padding-bottom: 0 !important;
								max-width: 100% !important;
								display: flex !important;
								gap: 14px !important;
							}
							.image-mission-wrap .image-v1,
							.image-mission-wrap img.image-v1 {
								width: 50% !important;
								max-width: 50% !important;
								height: 220px !important;
								border-radius: 14px !important;
							}
							.image-mission-wrap .image-v2,
							.image-mission-wrap img.image-v2 {
								position: static !important;
								width: 50% !important;
								max-width: 50% !important;
								height: 220px !important;
								border: none !important;
								border-radius: 14px !important;
								box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08) !important;
								display: block !important;
							}
						}
					`}</style>
					<div className="tf-widget-mission main-content">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12 col-lg-7">
									<div className="image-mission-wrap">
										<img
											src={aboutData?.mission_image1 || "images/about/tab1.jpg"}
											alt="Mission & Vision Showcase 1"
											className="image-v1 wow fadeInRight animated"
										/>
										<img
											src={aboutData?.mission_image2 || "images/about/tab2.jpg"}
											alt="Mission & Vision Showcase 2"
											className="image-v2 wow fadeInLeft animated"
										/>
									</div>
								</div>
								<div className="col-md-12 col-lg-5">
									<div className="mission-content">
										<div className="mission-tab">
											<nav>
												<div className="nav nav-tabs" id="nav-tab" role="tablist">
													<button className={isTab == 1 ? "nav-link active" : "nav-link"} id="nav-home-tab" onClick={() => handleTab(1)}>{aboutData?.mission_title || 'Our Mission'}</button>
													<button className={isTab == 2 ? "nav-link active" : "nav-link"} id="nav-profile-tab" onClick={() => handleTab(2)}>{aboutData?.vision_title || 'Our Vision'}</button>
												</div>
											</nav>
											<div className="tab-content" id="nav-tabContent">
												<div className={isTab == 1 ? "tab-pane fade show active" : "tab-pane fade"} role="tabpanel" aria-labelledby="nav-home-tab">
													<p className="post wow fadeInUp animated">
														{aboutData?.mission_body || 'Our mission is to foster a premier community where badminton enthusiasts can thrive through exceptional coaching, world-class facilities, and competitive tournaments.'}
													</p>
													<ul>
														{(aboutData?.mission_points ? aboutData.mission_points.split('\n').map(s => s.trim()).filter(Boolean) : [
															'Expert coaching and development programs',
															'State-of-the-art courts and facilities',
															'Frequent local and regional tournaments',
															'Fitness and agility training plans'
														]).map((pt, idx) => (
															<li key={idx} className="wow fadeInUp animated" data-wow-delay={`${0.1 * (idx + 1)}s`}>
																<span>
																	<svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.48438 0 0 4.48438 0 10C0 15.5156 4.48438 20 10 20C15.5156 20 20 15.5156 20 10C20 4.48438 15.5156 0 10 0Z" fill="#C3E92D" />
																		<path d="M14.4776 6.9806L14.4776 6.98061L14.4804 6.98344C14.5274 7.03036 14.5274 7.11222 14.4804 7.15914L8.62106 13.0185C8.59595 13.0436 8.56393 13.0557 8.5332 13.0557C8.50248 13.0557 8.47045 13.0436 8.44535 13.0185L5.51566 10.0888C5.46874 10.0419 5.46874 9.96005 5.51566 9.91312C5.56259 9.8662 5.64444 9.8662 5.69137 9.91312L8.17965 12.4014L8.5332 12.755L8.88676 12.4014L14.3047 6.98344L14.3047 6.98345L14.3075 6.9806C14.3538 6.93355 14.4313 6.93355 14.4776 6.9806Z" fill="#121212" stroke="#121212" />
																	</svg>
																	{pt}
																</span>
															</li>
														))}
													</ul>
												</div>
												<div className={isTab == 2 ? "tab-pane fade show active" : "tab-pane fade"} id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
													<p className="post wow fadeInUp animated">
														{aboutData?.vision_body || 'Our vision is to build champions that represent our academy at national levels, fostering sportsmanship and resilience in all our players.'}
													</p>
													<ul>
														{(aboutData?.vision_points ? aboutData.vision_points.split('\n').map(s => s.trim()).filter(Boolean) : [
															'Producing state and national champions',
															'Promoting a healthy and active lifestyle',
															'Providing world-class sports education',
															'Fostering teamwork and lifelong friendships'
														]).map((pt, idx) => (
															<li key={idx} className="wow fadeInUp animated" data-wow-delay={`${0.1 * (idx + 1)}s`}>
																<span>
																	<svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.48438 0 0 4.48438 0 10C0 15.5156 4.48438 20 10 20C15.5156 20 20 15.5156 20 10C20 4.48438 15.5156 0 10 0Z" fill="#C3E92D" />
																		<path d="M14.4776 6.9806L14.4776 6.98061L14.4804 6.98344C14.5274 7.03036 14.5274 7.11222 14.4804 7.15914L8.62106 13.0185C8.59595 13.0436 8.56393 13.0557 8.5332 13.0557C8.50248 13.0557 8.47045 13.0436 8.44535 13.0185L5.51566 10.0888C5.46874 10.0419 5.46874 9.96005 5.51566 9.91312C5.56259 9.8662 5.64444 9.8662 5.69137 9.91312L8.17965 12.4014L8.5332 12.755L8.88676 12.4014L14.3047 6.98344L14.3047 6.98345L14.3075 6.9806C14.3538 6.93355 14.4313 6.93355 14.4776 6.9806Z" fill="#121212" stroke="#121212" />
																	</svg>
																	{pt}
																</span>
															</li>
														))}
													</ul>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Team-member - Dynamic */}
					<style>{`
						.about-team-wrap { position: relative; overflow: hidden; border-radius: 12px; }
						.about-team-overlay {
							position: absolute; bottom: 0; left: 0; right: 0;
							background: linear-gradient(0deg, rgba(0,0,0,0.88) 60%, rgba(0,0,0,0.0) 100%);
							color: #fff; padding: 20px 16px 16px 16px;
							transform: translateY(100%);
							transition: transform 0.38s cubic-bezier(0.4,0,0.2,1);
							border-radius: 0 0 12px 12px;
						}
						.about-team-wrap:hover .about-team-overlay,
						.about-team-wrap.active-about .about-team-overlay { transform: translateY(0); }
						.about-team-name { font-size: 1rem; font-weight: 700; margin-bottom: 3px; color: #c8f542; }
						.about-team-role { font-size: 0.8rem; color: #bbb; margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.04em; }
						.about-team-bio { font-size: 0.82rem; line-height: 1.5; color: #ddd; margin: 0; }
						@media (max-width: 768px) {
							.about-team-overlay { transform: translateY(0) !important; background: linear-gradient(0deg, rgba(0,0,0,0.82) 80%, rgba(0,0,0,0.0) 100%); }
						}
					`}</style>
					<div className="tf-widget-team main-content">
						<div className="themeflat-container">
							<div className="team-member">
								<div className="title-box title-small center-title-box">
									<span className="sub-title wow fadeInUp animated">Our team</span>
									<h2 className="title-section wow fadeInUp animated">our member, coach</h2>
								</div>
								<div className="row team">
									{(teamMembers.length > 0 ? teamMembers : [
										{ name: "Chris Pad", role: "Co - Founder SK Sports", about: "", image: "images/member/team1.png" },
										{ name: "Maverick", role: "Manager", about: "", image: "images/member/team2.png" },
										{ name: "Jessica Nguyen", role: "Coach", about: "", image: "images/member/team3.png" },
										{ name: "Jenifer Nolan", role: "Co - Founder SK Sports", about: "", image: "images/member/team4.png" }
									]).map((member, index) => (
										<div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3" key={index}>
											<div
												className="team-item wow fadeInUp animated about-team-wrap"
												data-wow-delay={`${0.1 + (index * 0.2)}s`}
											>
												<div className="team-image" style={{ position: 'relative' }}>
													<img
														src={member.image && member.image.length > 5 ? member.image : "images/member/team1.png"}
														alt={member.name}
														style={{ objectFit: 'cover', objectPosition: 'top', width: '100%', height: '350px', display: 'block' }}
													/>
													<div className="shape-team" />
													<div className="about-team-overlay">
														<div className="about-team-name">{member.name}</div>
														<div className="about-team-role">{member.role}</div>
														{member.about && <p className="about-team-bio">{member.about}</p>}
													</div>
												</div>
												<h3 className="name-member">{member.name}</h3>
												<h4 className="job">{member.role}</h4>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>{/* Team-member */}

				</div>

			</Layout>
		</>
	)
}
