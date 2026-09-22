
import { useState } from "react"
import { Link } from "react-router-dom"
// import CartExpirationTimer from "../components/elements/CartExpirationTimer"
import CartExpirationTimer from "../../elements/CartExpirationTimer"
import Menu from "../Menu"

export default function Header1({ scroll, isMobileMenu, handleMobileMenu, isCart, handleCart, isLogin, handleLogin, isRegister, handleRegister, isForgotPass, handleForgotPass, handleMembership }) {
	const [isToggled, setToggled] = useState(false)
	const handleToggled = () => setToggled(!isToggled)

	const handleLogoClick = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
		if (isMobileMenu && handleMobileMenu) {
			handleMobileMenu();
		}
	};

	return (
		<>

			<div className="header-top">
				<div className="themeflat-container">
					<div className="header-top-inner">
						<div className="address">
							<a href="tel:8883422888"><i className="icon-phone-call" />8883422888</a>
							<address
								title="2/364, Kalivelampatti Pirivu, Coimbatore - Trichy Rd, opp. Kongu Kalyana Mandapam, Palladam, Tamil Nadu 641662"
								style={{
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									maxWidth: '45vw',
									display: 'inline-block',
									verticalAlign: 'bottom',
									marginBottom: 0
								}}
							>
								<i className="icon-Vector-22" />
								2/364, Kalivelampatti Pirivu, Coimbatore - Trichy Rd, opp. Kongu Kalyana Mandapam, Palladam, Tamil Nadu 641662
							</address>
						</div>
						<div className="social-icon">
							<Link to="/facebook"><i className="icon-facebook" /></Link>
							<Link to="/instagram"><i className="icon-instagram" /></Link>
							<Link to="/youtube"><i className="icon-youtube" /></Link>
						</div>
					</div>
				</div>
			</div>

			<header id="header" className={`header style1 clearfix ${scroll ? 'downscrolled' : ''}`}>
				<div className="themeflat-container">
					<div className="header-inner">
						<div id="logo" className="logo" style={{ marginTop: '8px', marginBottom: '8px' }}>
							<Link to="/" rel="home" onClick={handleLogoClick} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
								<img id="a2" src="images/sk-sports-logo.png" alt="SK Sports" style={{ height: '86px', width: 'auto', display: 'block', transition: 'transform 0.2s ease' }} />
								<span className="logo-tagline" style={{
									fontSize: '11px',
									fontWeight: 800,
									letterSpacing: '1.6px',
									color: '#C7F000',
									textTransform: 'uppercase',
									marginTop: '3px',
									whiteSpace: 'nowrap',
									lineHeight: 1,
									textAlign: 'center',
									display: 'block'
								}}>
									Train <span style={{ color: 'rgba(255, 255, 255, 0.45)', margin: '0 2px' }}>|</span> Compete <span style={{ color: 'rgba(255, 255, 255, 0.45)', margin: '0 2px' }}>|</span> Excel
								</span>
							</Link>
						</div>{/* /.logo */}
						<div className="nav-wrap">
							<div className={`btn-menu ${isMobileMenu ? 'active' : ''}`} onClick={handleMobileMenu} role="button" aria-label="Toggle navigation">
								<span className="line-1" />
							</div>{/* //mobile menu button */}
							<nav id="mainnav" className="mainnav">
								<div id="logo-mobie" className="logo">
									<Link to="/" rel="home" onClick={handleLogoClick} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', textDecoration: 'none' }}>
										<img src="images/sk-sports-logo.png" alt="SK Sports" style={{ height: '76px', width: 'auto', display: 'block' }} />
										<span className="logo-tagline" style={{
											fontSize: '10.5px',
											fontWeight: 800,
											letterSpacing: '1.5px',
											color: '#C7F000',
											textTransform: 'uppercase',
											marginTop: '4px',
											whiteSpace: 'nowrap',
											lineHeight: 1,
											display: 'block'
										}}>
											Train <span style={{ color: 'rgba(255, 255, 255, 0.45)', margin: '0 2px' }}>|</span> Compete <span style={{ color: 'rgba(255, 255, 255, 0.45)', margin: '0 2px' }}>|</span> Excel
										</span>
									</Link>
								</div>{/* /.logo */}
								<Menu />
							</nav>{/* /.mainnav */}
						</div>{/* /.nav-wrap */}
						<div className="header-right">
							<button className="btn-contact" type="button" onClick={handleMembership}>Membership</button>
							{/* /.login/register */}
						</div>{/* /.login-wrap */}
					</div>{/* /.header-inner */}
				</div>
			</header>

		</>
	)
}
