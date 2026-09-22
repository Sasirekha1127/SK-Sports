
import { Link } from "react-router-dom"

export default function Team2() {
	return (
		<>

			<div className="tf-widget-team main-content background-grey">
				<div className="themeflat-container">
					<div className="team-member">
						{/* header style v2 */}
						<div className="title-box-v2 title-small center-title-box">
							<span className="sub-title wow fadeInUp animated">Our team</span>
							<h2 className="title-section wow fadeInUp animated">our member, couch</h2>
						</div>{/* header style v2 */}
						<div className="row team">
							<div className="col-12 col-sm-6 col-md-6 col-lg-3">
								<div className="team-item team-v2 wow fadeInUp animated" data-wow-delay="0.7=1s">
									<div className="team-image">
										<img src="images/member/team1.jpg" alt="Team member" />

										<div className="shape-team" />
									</div>
									<h3 className="name-member">Chris pad</h3>
									<h4 className="job">Co - Founder SK Sports</h4>
								</div>
							</div>
							<div className="col-12 col-sm-6 col-md-6 col-lg-3">
								<div className="team-item team-v2 wow fadeInUp animated" data-wow-delay="0.3s">
									<div className="team-image">
										<img src="images/member/team2.jpg" alt="Team member" />

										<div className="shape-team" />
									</div>
									<h3 className="name-member">maverick</h3>
									<h4 className="job">Manager</h4>
								</div>
							</div>
							<div className="col-12 col-sm-6 col-md-6 col-lg-3">
								<div className="team-item team-v2 wow fadeInUp animated" data-wow-delay="0.5s">
									<div className="team-image">
										<img src="images/member/team3.jpg" alt="Team member" />

										<div className="shape-team" />
									</div>
									<h3 className="name-member">Jessica nguyen</h3>
									<h4 className="job">Coach</h4>
								</div>
							</div>
							<div className="col-12 col-sm-6 col-md-6 col-lg-3">
								<div className="team-item team-v2 wow fadeInUp animated" data-wow-delay="0.7s">
									<div className="team-image">
										<img src="images/member/team4.jpg" alt="Team member" />

										<div className="shape-team" />
									</div>
									<h3 className="name-member">jenifer nolan</h3>
									<h4 className="job">Co - Founder SK Sports</h4>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
