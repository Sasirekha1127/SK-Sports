import { useState, useEffect } from "react"

export default function Team1() {
	const [teamMembers, setTeamMembers] = useState([]);
	const [activeAbout, setActiveAbout] = useState(null);
	const apiUrl = process.env.REACT_APP_API_URL || '/api';

	useEffect(() => {
		fetch(`${apiUrl}/team`)
			.then(r => r.json())
			.then(data => {
				const items = Array.isArray(data) ? data : (data.data || []);
				const active = items.filter(item => item.status === 'active' || !item.status);
				if (active.length > 0) {
					setTeamMembers(active);
				}
			})
			.catch(console.error);
	}, [apiUrl]);

	const displayMembers = teamMembers.length > 0 ? teamMembers : [
		{ name: "Chris Pad", role: "Co - Founder SK Sports", about: "", image: "images/member/team1.png" },
		{ name: "Maverick", role: "Manager", about: "", image: "images/member/team2.png" },
		{ name: "Jessica Nguyen", role: "Coach", about: "", image: "images/member/team3.png" },
		{ name: "Jenifer Nolan", role: "Co - Founder SK Sports", about: "", image: "images/member/team4.png" }
	];

	return (
		<>
			<style>{`
				.team-card-wrap {
					position: relative;
					overflow: hidden;
					border-radius: 12px;
				}
				.team-about-overlay {
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					background: linear-gradient(0deg, rgba(0,0,0,0.88) 60%, rgba(0,0,0,0.0) 100%);
					color: #fff;
					padding: 20px 16px 16px 16px;
					transform: translateY(100%);
					transition: transform 0.38s cubic-bezier(0.4,0,0.2,1);
					border-radius: 0 0 12px 12px;
				}
				.team-card-wrap:hover .team-about-overlay,
				.team-card-wrap.active-about .team-about-overlay {
					transform: translateY(0);
				}
				.team-about-name {
					font-size: 1rem;
					font-weight: 700;
					margin-bottom: 3px;
					color: #c8f542;
				}
				.team-about-role {
					font-size: 0.8rem;
					color: #bbb;
					margin-bottom: 7px;
					text-transform: uppercase;
					letter-spacing: 0.04em;
				}
				.team-about-text {
					font-size: 0.82rem;
					line-height: 1.5;
					color: #ddd;
					margin: 0;
				}
				.team-about-btn {
					display: inline-block;
					margin-top: 8px;
					font-size: 0.78rem;
					background: #c8f542;
					color: #111;
					border: none;
					border-radius: 6px;
					padding: 4px 12px;
					font-weight: 600;
					cursor: pointer;
					transition: background 0.2s;
				}
				.team-about-btn:hover { background: #b0e030; }
				@media (max-width: 768px) {
					.team-about-overlay {
						transform: translateY(0) !important;
						background: linear-gradient(0deg, rgba(0,0,0,0.82) 80%, rgba(0,0,0,0.0) 100%);
					}
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
							{displayMembers.map((member, index) => (
								<div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3" key={index}>
									<div
										className="team-item wow fadeInUp animated team-card-wrap"
										data-wow-delay={`${0.1 + (index * 0.2)}s`}
									>
										<div className="team-image" style={{ position: 'relative' }}>
											<img
												src={member.image && member.image.length > 5 ? member.image : "images/member/team1.png"}
												alt={member.name}
												style={{ objectFit: 'cover', objectPosition: 'top', width: '100%', height: '350px', display: 'block' }}
											/>
											<div className="shape-team" />

											{/* About Overlay */}
											<div className="team-about-overlay">
												<div className="team-about-name">{member.name}</div>
												<div className="team-about-role">{member.role}</div>
												{member.about && (
													<p className="team-about-text">{member.about}</p>
												)}
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
			</div>
		</>
	)
}
