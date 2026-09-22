

import { useEffect, useState } from "react"
import BackToTop from '../elements/BackToTop'
import Footer1 from './footer/Footer1'
import Footer2 from './footer/Footer2'
import Header1 from "./header/Header1"
import Header2 from './header/Header2'
import MobileMenu from './MobileMenu'
import ModalForgotPassword from "./ModalForgotPassword"
import ModalLogin from "./ModalLogin"
import ModalRegister from "./ModalRegister"
import ModalMembership from "./ModalMembership"

export default function Layout({ headerStyle, footerStyle, breadcrumbTitle, children,backAlt }) {
	const [scroll, setScroll] = useState(0)
	// Mobile Menu
	const [isMobileMenu, setMobileMenu] = useState(false)
	const handleMobileMenu = () => setMobileMenu(!isMobileMenu)

	// Cart
	const [isCart, setCart] = useState(false)
	const handleCart = () => setCart(!isCart)

	const [isLogin, setLogin] = useState(false)
	const handleLogin = () => {
		setLogin(!isLogin)
		!isLogin ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
	}
	// Register
	const [isRegister, setRegister] = useState(false)
	const handleRegister = () => {
		setRegister(!isRegister)
		!isRegister ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
	}
	const [isForgotPass, setForgotPass] = useState(false)
	const handleForgotPass = () => {
		setForgotPass(!isForgotPass)
		!isForgotPass ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
	}

	// Membership Modal
	const [isMembership, setMembership] = useState(false)
	const handleMembership = () => {
		setMembership(prev => {
			const next = !prev;
			if (next) {
				document.body.classList.add("modal-open");
			} else {
				document.body.classList.remove("modal-open");
			}
			return next;
		});
	}

	useEffect(() => {
		const onOpenMembership = () => {
			setMembership(true);
			document.body.classList.add("modal-open");
		};
		window.addEventListener("open-membership-modal", onOpenMembership);
		return () => window.removeEventListener("open-membership-modal", onOpenMembership);
	}, []);

	useEffect(() => {
		document.documentElement.classList.add('js-animated');

		const onScroll = () => {
			setScroll(window.scrollY > 100);
		};
		window.addEventListener("scroll", onScroll, { passive: true });

		// Smooth, Flicker-Free Repeat Scroll Animation Engine
		const observedElements = new WeakSet();

		// Helper to check if an element is currently in view
		const isInViewport = (el, buffer = 0) => {
			const rect = el.getBoundingClientRect();
			return rect.top < (window.innerHeight + buffer) && rect.bottom > -buffer;
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const el = entry.target;
				if (entry.isIntersecting) {
					// Apply delay if specified (capped at 0.3s so it's smooth and never laggy)
					const rawDelay = el.getAttribute('data-wow-delay');
					if (rawDelay) {
						const parsed = parseFloat(rawDelay);
						if (!isNaN(parsed) && parsed > 0) {
							const capped = Math.min(parsed, 0.3);
							el.style.transitionDelay = `${capped}s`;
						}
					}
					el.setAttribute('data-in-view', 'true');
					el.classList.add('in-view');
				} else {
					// Element is far outside the viewport (past top or bottom buffer):
					// Only reset when it is truly far away so scrolling near edges never causes blinking
					el.removeAttribute('data-in-view');
					el.classList.remove('in-view');
					el.style.transitionDelay = '0s';
				}
			});
		}, {
			root: null,
			// 250px buffer at the top: prevents elements from resetting/blinking when scrolling up and down
			// -40px buffer at the bottom: triggers deliberate smooth entrance when scrolling down
			rootMargin: '250px 0px -40px 0px',
			threshold: 0.05
		});

		const scanAndObserve = () => {
			const elements = document.querySelectorAll('.wow');
			elements.forEach((el) => {
				if (!observedElements.has(el)) {
					observedElements.add(el);
					// If already in viewport on mount, activate immediately to prevent initial blank flash
					if (isInViewport(el)) {
						el.setAttribute('data-in-view', 'true');
						el.classList.add('in-view');
					}
					observer.observe(el);
				}
			});
		};

		// Initial scan
		scanAndObserve();

		// Watch for dynamically added DOM elements (API fetches, route changes, tabs)
		const mutationObserver = new MutationObserver(() => {
			scanAndObserve();
		});

		mutationObserver.observe(document.body, {
			childList: true,
			subtree: true
		});

		return () => {
			window.removeEventListener("scroll", onScroll);
			observer.disconnect();
			mutationObserver.disconnect();
		};
	}, [])
	return (
		<><div id="top" />
			{/* <AddClassBody /> */}
			{!headerStyle && <Header1
				scroll={scroll}
				isMobileMenu={isMobileMenu}
				handleMobileMenu={handleMobileMenu}
				isCart={isCart}
				handleCart={handleCart}
				isLogin={isLogin}
				handleLogin={handleLogin}
				isRegister={isRegister}
				handleRegister={handleRegister}
				isForgotPass={isForgotPass}
				handleForgotPass={handleForgotPass}
				handleMembership={handleMembership}
			/>}
			{headerStyle == 1 ? <Header1
				scroll={scroll}
				isMobileMenu={isMobileMenu}
				handleMobileMenu={handleMobileMenu}
				isCart={isCart}
				handleCart={handleCart}
				isLogin={isLogin}
				handleLogin={handleLogin}
				isRegister={isRegister}
				handleRegister={handleRegister}
				isForgotPass={isForgotPass}
				handleForgotPass={handleForgotPass}
				handleMembership={handleMembership}
			/> : null}

			{headerStyle == 2 ? <Header2
				scroll={scroll}
				isMobileMenu={isMobileMenu}
				handleMobileMenu={handleMobileMenu}
				isCart={isCart}
				handleCart={handleCart}
				isLogin={isLogin}
				handleLogin={handleLogin}
				isRegister={isRegister}
				handleRegister={handleRegister}
				isForgotPass={isForgotPass}
				handleForgotPass={handleForgotPass}
				handleMembership={handleMembership}
			/> : null}
			<MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} handleMembership={handleMembership} />


			{children}

			{!footerStyle && < Footer1 />}
			{footerStyle == 1 ? < Footer1 /> : null}
			{footerStyle == 2 ? < Footer2 /> : null} 

			<ModalLogin
				isLogin={isLogin}
				handleLogin={handleLogin}
				isRegister={isRegister}
				handleRegister={handleRegister}
				isForgotPass={isForgotPass}
				handleForgotPass={handleForgotPass}
			/>
			<ModalRegister
				isRegister={isRegister}
				handleRegister={handleRegister}
				isLogin={isLogin}
				handleLogin={handleLogin}
			/>
			<ModalForgotPassword
				isForgotPass={isForgotPass}
				handleForgotPass={handleForgotPass}
				isLogin={isLogin}
				handleLogin={handleLogin}
			/>
			<ModalMembership
				isMembership={isMembership}
				handleMembership={handleMembership}
			/>
		</>
	)
}
