
import { Link } from "react-router-dom"

export default function Banner() {
	return (
		<>

			<div className="tf-widget-banner" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/images/about/badminton-court.png')", backgroundAttachment: "fixed", backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
				<div className="themeflat-container">
					<div className="tf-banne-paralax">
						<h2 className="title-banner wow fadeInUp animated" style={{ color: "#ffffff", textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}>
							Join Our Badminton Academy Now
						</h2>
						<span className="sale wow fadeInUp animated">Free Trial!</span>
						<h1 className="wow fadeInUp animated" style={{ fontSize: "clamp(3rem, 10vw, 8rem)", fontWeight: 900, fontStyle: "italic", color: "#fff", textTransform: "uppercase", margin: "20px 0", lineHeight: 1 }}>BADMINTON</h1>
						<a 
							href="#membership" 
							onClick={(e) => {
								e.preventDefault();
								window.dispatchEvent(new CustomEvent('open-membership-modal'));
							}} 
							className="flat-button wow fadeInUp animated"
							style={{ cursor: 'pointer', textDecoration: 'none' }}
						>
							Join now
						</a>
					</div>
				</div>
			</div>
		</>
	)
}
