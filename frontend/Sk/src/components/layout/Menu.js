import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Menu() {
const location = useLocation()
const [currentMenuItem, setCurrentMenuItem] = useState("")
    const [navItems, setNavItems] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL || '/api';

useEffect(() => {
setCurrentMenuItem(location.pathname)
window.scrollTo(0, 0)
}, [location.pathname])

    useEffect(() => {
        fetch(`${apiUrl}/navigation`)
            .then(r => r.json())
            .then(data => {
                if(data && Array.isArray(data)) {
                    setNavItems(data.filter(n => n.enabled));
                }
            })
            .catch(console.error);
    }, [apiUrl]);

	const checkCurrentMenuItem = (path) => currentMenuItem === path ? "current-menu-item" : ""

	const handleNavClick = (url) => {
		if (url === '/' || location.pathname === url) {
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		}
	};

	return (
		<>
			<ul className="menu">
				{navItems.length > 0 ? navItems.map((n, i) => (
					<li key={i} className={"item " + checkCurrentMenuItem(n.url)}>
						<Link to={n.url} onClick={() => handleNavClick(n.url)}>{n.label}</Link>
					</li>
				)) : (
					<>
						<li className={"item " + checkCurrentMenuItem("/")}>
							<Link to="/" onClick={() => handleNavClick("/")}>Home page</Link>
						</li>
						<li className={"item " + checkCurrentMenuItem("/about")}>
							<Link to="/about" onClick={() => handleNavClick("/about")}>About us</Link>
						</li>
						<li className={"item " + checkCurrentMenuItem("/event")}>
							<Link to="/event" onClick={() => handleNavClick("/event")}>Our Events</Link>
						</li>
						<li className={"item " + checkCurrentMenuItem("/blog")}>
							<Link to="/blog" onClick={() => handleNavClick("/blog")}>Latest News</Link>
						</li>
						<li className={"item " + checkCurrentMenuItem("/contact")}>
							<Link to="/contact" onClick={() => handleNavClick("/contact")}>Contact us</Link>
						</li>
					</>
				)}
			</ul>
		</>
	)
}


