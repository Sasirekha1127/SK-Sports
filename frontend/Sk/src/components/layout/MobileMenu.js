import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function MobileMenu({ isMobileMenu, handleMobileMenu, handleMembership }) {
    const location = useLocation()
    const [currentMenuItem, setCurrentMenuItem] = useState("")
    const [navItems, setNavItems] = useState([])
    const apiUrl = process.env.REACT_APP_API_URL || '/api'

    useEffect(() => {
        setCurrentMenuItem(location.pathname)
    }, [location.pathname])

    useEffect(() => {
        fetch(apiUrl + '/navigation')
            .then(r => r.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    setNavItems(data.filter(n => n.enabled));
                }
            })
            .catch(console.error);
    }, [apiUrl]);

    // Lock background scrolling when mobile menu drawer is open
    useEffect(() => {
        if (isMobileMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenu]);

    const checkCurrentMenuItem = (path) => currentMenuItem === path ? "current-menu-item" : ""

    const defaultMenuItems = [
        {
            url: "/",
            label: "Home Page",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z" />
                </svg>
            )
        },
        {
            url: "/about",
            label: "About Us",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            )
        },
        {
            url: "/event",
            label: "Our Events",
            badge: "Tournaments",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
                    <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                </svg>
            )
        },
        {
            url: "/blog",
            label: "Latest News",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6Z" />
                </svg>
            )
        },
        {
            url: "/contact",
            label: "Contact Us",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
            )
        }
    ]

    const itemsToRender = navItems.length > 0 
        ? navItems.map(item => ({
            url: item.url,
            label: item.label,
            icon: defaultMenuItems.find(d => d.url === item.url)?.icon || (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="8" />
                    <path d="m12 8 4 4-4 4" />
                </svg>
            )
        }))
        : defaultMenuItems;

    const handleLinkClick = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (handleMobileMenu) {
            handleMobileMenu();
        }
    }

    return (
        <>
            {/* Backdrop Blur Overlay */}
            <div 
                className={`mobile-nav-backdrop ${isMobileMenu ? 'active' : ''}`} 
                onClick={handleMobileMenu}
                aria-hidden="true"
            />

            {/* Slide-in Mobile Navigation Drawer */}
            <nav 
                id="mobile-main-nav" 
                className={`mobile-nav-drawer ${isMobileMenu ? 'active' : ''}`}
                aria-label="Mobile Navigation"
            >
                {/* Drawer Top Header */}
                <div className="mobile-drawer-header">
                    <Link to="/" onClick={handleLinkClick} className="mobile-drawer-brand">
                        <img src="images/sk-sports-logo.png" alt="SK Sports" />
                        <div className="mobile-drawer-brand-text">
                            <span className="mobile-drawer-brand-title">SK SPORTS</span>
                            <span className="mobile-drawer-brand-tagline">TRAIN | COMPETE | EXCEL</span>
                        </div>
                    </Link>
                    <button 
                        type="button" 
                        className="mobile-drawer-close" 
                        onClick={handleMobileMenu}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                {/* Drawer Scrollable Content */}
                <div className="mobile-drawer-body">
                    <div className="mobile-drawer-section-title">Navigation</div>
                    
                    <ul id="menu-mobile-menu" className="mobile-menu-items">
                        {itemsToRender.map((item, idx) => (
                            <li key={idx} className={checkCurrentMenuItem(item.url)}>
                                <Link 
                                    to={item.url} 
                                    className="mobile-menu-link"
                                    onClick={handleLinkClick}
                                >
                                    <div className="mobile-menu-link-left">
                                        <span className="mobile-menu-icon-wrap">
                                            {item.icon}
                                        </span>
                                        <span className="mobile-menu-label">{item.label}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {item.badge && (
                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: 800,
                                                letterSpacing: '0.5px',
                                                padding: '2px 7px',
                                                borderRadius: '4px',
                                                backgroundColor: 'rgba(199, 240, 0, 0.15)',
                                                color: '#C7F000',
                                                textTransform: 'uppercase'
                                            }}>
                                                {item.badge}
                                            </span>
                                        )}
                                        <svg className="mobile-menu-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Academy Quick Highlights Card */}
                    <div className="mobile-academy-card">
                        <div className="mobile-court-badge">
                            <span>🏸</span>
                            <span>6 Synthetic Courts</span>
                        </div>

                        <div className="mobile-academy-info-row">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Open Daily: <strong>5:00 AM – 10:00 PM</strong></span>
                        </div>

                        <a href="tel:8883422888" className="mobile-academy-info-row" style={{ color: '#C7F000' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span>Call: <strong>+91 8883422888</strong></span>
                        </a>

                        <div className="mobile-academy-info-row" style={{ fontSize: '12px', color: '#94a3b8' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>Palladam, Coimbatore - Trichy Rd</span>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA Button */}
                {handleMembership && (
                    <div className="mobile-drawer-footer">
                        <button
                            type="button"
                            className="mobile-join-btn"
                            onClick={() => {
                                if (handleMobileMenu) handleMobileMenu();
                                if (handleMembership) handleMembership();
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>🏸</span>
                            <span>JOIN SK SPORTS</span>
                        </button>
                    </div>
                )}
            </nav>
        </>
    )
}
