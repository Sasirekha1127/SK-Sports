import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/layout/Layout"

export default function Contact() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		age: '',
		message: ''
	})
	const [errors, setErrors] = useState({})
	const [touched, setTouched] = useState({})
	const [submitting, setSubmitting] = useState(false)
	const [status, setStatus] = useState(null)

	// Auto-hide success message after 3 seconds so the clean form returns
	useEffect(() => {
		if (status?.type === 'success') {
			const timer = setTimeout(() => {
				setStatus(null)
			}, 3000)
			return () => clearTimeout(timer)
		}
	}, [status])

	const validateField = (fieldName, value) => {
		const val = (value || '').trim()
		switch (fieldName) {
			case 'name':
				if (!val) return 'Name is required'
				if (val.length < 2) return 'Name must be at least 2 characters'
				if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Name can only contain letters and spaces'
				return ''
			case 'email':
				if (!val) return 'Email is required'
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address'
				return ''
			case 'phone': {
				if (!val) return 'Phone number is required'
				const digits = val.replace(/\D/g, '')
				if (digits.length !== 10) {
					return 'Please enter a valid 10-digit phone number'
				}
				return ''
			}
			case 'age': {
				if (val) {
					const num = Number(val)
					if (isNaN(num) || num < 3 || num > 120) {
						return 'Age must be between 3 and 120'
					}
				}
				return ''
			}
			case 'message':
				if (!val) return 'Message is required'
				if (val.length < 5) return 'Message must be at least 5 characters'
				return ''
			default:
				return ''
		}
	}

	const handleChange = (e) => {
		let { name, value } = e.target
		// Strictly restrict phone and age to digits only
		if (name === 'phone') {
			value = value.replace(/\D/g, '').slice(0, 10)
		} else if (name === 'age') {
			value = value.replace(/\D/g, '').slice(0, 3)
		}
		setFormData(prev => ({ ...prev, [name]: value }))
		if (touched[name]) {
			const err = validateField(name, value)
			setErrors(prev => ({ ...prev, [name]: err }))
		}
	}

	const handleBlur = (e) => {
		const { name, value } = e.target
		setTouched(prev => ({ ...prev, [name]: true }))
		const err = validateField(name, value)
		setErrors(prev => ({ ...prev, [name]: err }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		const allFields = ['name', 'email', 'phone', 'age', 'message']
		const newTouched = {}
		const newErrors = {}

		allFields.forEach(f => {
			newTouched[f] = true
			const err = validateField(f, formData[f])
			if (err) newErrors[f] = err
		})

		setTouched(newTouched)
		setErrors(newErrors)

		if (Object.keys(newErrors).length > 0) {
			setStatus({ type: 'error', message: 'Please correct the highlighted errors before submitting.' })
			return
		}

		setSubmitting(true)
		setStatus(null)

		try {
			const apiUrl = process.env.REACT_APP_API_URL || '/api'
			const res = await fetch(`${apiUrl}/contact`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			const data = await res.json()
			if (res.ok && data.success) {
				setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully. We will get back to you shortly.' })
				setFormData({ name: '', email: '', phone: '', age: '', message: '' })
				setTouched({})
				setErrors({})
			} else {
				setStatus({ type: 'error', message: data.message || 'Failed to send message. Please try again.' })
			}
		} catch (err) {
			console.error('Contact submit error:', err)
			setStatus({ type: 'error', message: 'Network error. Please try again later.' })
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<>

			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div>
					<div className="page-title page-title-blog">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12">
									<div className="page-title-heading">
										<h1 className="title">Contact Us</h1>
									</div>{/* /.page-title-captions */}
									<div className="breadcrumbs">
										<ul>
											<li><Link to="/">Homepage</Link></li>
											<li><i className="icon-Arrow---Right-2" /></li>
											<li><a>Contact Us</a></li>
										</ul>
									</div>{/* /.breadcrumbs */}
								</div>{/* /.col-md-12 */}
							</div>{/* /.row */}
						</div>{/* /.container */}
					</div>{/* /.page-title */}
					{/* Map Contact us */}
					<div className="map-contact-us">
						<div className="map-contact relative">
							<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2643.6895046810805!2d-122.52642526124438!3d38.00014098339506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085976736097a2f%3A0xbe014d20e6e22654!2sSan Rafael%2C California%2C Hoa Kỳ!5e0!3m2!1svi!2s!4v1678975266976!5m2!1svi!2s" height={570} style={{ border: 0, width: "100%" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
						</div>
					</div>
					{/* Map Contact us */}
					{/* Contact us */}
					<div className="tf-contact-page main-content">
						<div className="themeflat-container">
							<div className="row contact-page">
								<div className="col-md-5">
									<div className="contact-page-content">
										<div className="content-page-title">
											<span className="wow fadeInUp animated">Contact us</span>
											<h2 className="wow fadeInUp animated">Get it touch</h2>
											<p className="post wow fadeInUp animated">In the 14 years since she first graced our screens in
												Keeping Up With The
												Kardashians.</p>
										</div>
										<div className="list-contact-us">
											<div className="inner">
												<span className="wow fadeInUp animated">Phone: </span>
												<h6 className="wow fadeInUp animated">8883422888, 978886004</h6>
											</div>
											<div className="inner">
												<span className="wow fadeInUp animated">Email:</span>
												<a href="mailto:glowflosports@gmail.com" className="wow fadeInUp animated">
													<h6>glowflosports@gmail.com</h6>
												</a>
											</div>
											<div className="inner">
												<span className="wow fadeInUp animated">Location:</span>
												<h6 className="wow fadeInUp animated">2/364, Kalivelampatti Pirivu, Coimbatore - Trichy Rd, opp. Kongu Kalyana Mandapam, Palladam, Tamil Nadu 641662</h6>
											</div>
										</div>
										<div className="social-contact">
											<ul className="social-media wow fadeInUp animated">
												<li>
													<Link to="/facebook"><i className="icon-facebook" /></Link>
												</li>
												<li>
													<Link to="/instagram"><i className="icon-instagram" /></Link>
												</li>
												<li>
													<Link to="/youtube"><i className="icon-youtube" /></Link>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div className="col-md-7 wow fadeInRight animated">
									<div className="contact-page-form">
										{status && (
											<div style={{
												padding: '14px 18px',
												borderRadius: '8px',
												marginBottom: '24px',
												fontSize: '14px',
												fontWeight: '500',
												display: 'flex',
												alignItems: 'center',
												gap: '10px',
												backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
												border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`,
												color: status.type === 'success' ? '#065f46' : '#991b1b',
												boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
											}}>
												<span style={{ fontSize: '18px', fontWeight: 'bold' }}>{status.type === 'success' ? '✓' : '⚠'}</span>
												<span>{status.message}</span>
											</div>
										)}
										<form id="contactform-page" className="contact-page form-submit" onSubmit={handleSubmit} acceptCharset="utf-8" noValidate>
											<div className="text-wrap clearfix">
												<fieldset className="name-wrap" style={{ position: 'relative' }}>
													<input
														type="text"
														id="name"
														className="tb-my-input"
														name="name"
														placeholder="Your name*"
														size={32}
														value={formData.name}
														onChange={handleChange}
														onBlur={handleBlur}
														style={{
															borderColor: (errors.name && touched.name) ? '#ef4444' : undefined,
															outlineColor: (errors.name && touched.name) ? '#ef4444' : undefined
														}}
													/>
													{errors.name && touched.name && (
														<span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '4px', fontWeight: 500 }}>
															{errors.name}
														</span>
													)}
												</fieldset>
												<fieldset className="email-wrap" style={{ position: 'relative' }}>
													<input
														type="email"
														id="email"
														className="tb-my-input"
														name="email"
														placeholder="Your email*"
														size={32}
														value={formData.email}
														onChange={handleChange}
														onBlur={handleBlur}
														style={{
															borderColor: (errors.email && touched.email) ? '#ef4444' : undefined,
															outlineColor: (errors.email && touched.email) ? '#ef4444' : undefined
														}}
													/>
													{errors.email && touched.email && (
														<span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '4px', fontWeight: 500 }}>
															{errors.email}
														</span>
													)}
												</fieldset>
												<fieldset className="phone-wrap" style={{ position: 'relative' }}>
													<input
														type="tel"
														id="phone"
														className="tb-my-input"
														name="phone"
														placeholder="Telephone (10 digits)*"
														size={32}
														value={formData.phone}
														maxLength={10}
														inputMode="numeric"
														pattern="[0-9]*"
														onKeyDown={(e) => {
															if (!/[0-9]/.test(e.key) && !['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
																e.preventDefault();
															}
														}}
														onChange={handleChange}
														onBlur={handleBlur}
														style={{
															borderColor: (errors.phone && touched.phone) ? '#ef4444' : undefined,
															outlineColor: (errors.phone && touched.phone) ? '#ef4444' : undefined
														}}
													/>
													{errors.phone && touched.phone && (
														<span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '4px', fontWeight: 500 }}>
															{errors.phone}
														</span>
													)}
												</fieldset>
												<fieldset className="age-wrap" style={{ position: 'relative' }}>
													<input
														type="text"
														id="age"
														className="tb-my-input"
														name="age"
														placeholder="Age (Optional)"
														size={32}
														value={formData.age}
														maxLength={3}
														inputMode="numeric"
														pattern="[0-9]*"
														onKeyDown={(e) => {
															if (!/[0-9]/.test(e.key) && !['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
																e.preventDefault();
															}
														}}
														onChange={handleChange}
														onBlur={handleBlur}
														style={{
															borderColor: (errors.age && touched.age) ? '#ef4444' : undefined,
															outlineColor: (errors.age && touched.age) ? '#ef4444' : undefined
														}}
													/>
													{errors.age && touched.age && (
														<span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '4px', fontWeight: 500 }}>
															{errors.age}
														</span>
													)}
												</fieldset>
											</div>
											<fieldset className="message-wrap" style={{ position: 'relative' }}>
												<textarea
													id="comment-message"
													name="message"
													rows={3}
													placeholder="Your Message*"
													value={formData.message}
													onChange={handleChange}
													onBlur={handleBlur}
													style={{
														borderColor: (errors.message && touched.message) ? '#ef4444' : undefined,
														outlineColor: (errors.message && touched.message) ? '#ef4444' : undefined
													}}
												/>
												{errors.message && touched.message && (
													<span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '-16px', marginBottom: '16px', fontWeight: 500 }}>
														{errors.message}
													</span>
												)}
											</fieldset>
											<button
												name="submit"
												type="submit"
												id="comment-reply"
												className="flat-button btn-submit-comment"
												disabled={submitting}
												style={{
													opacity: submitting ? 0.7 : 1,
													cursor: submitting ? 'not-allowed' : 'pointer',
													display: 'inline-flex',
													alignItems: 'center',
													gap: '8px'
												}}
											>
												<span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</Layout>
		</>
	)
}