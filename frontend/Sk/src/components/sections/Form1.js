import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function Form1() {
	const [settings, setSettings] = useState(null)
	const apiUrl = process.env.REACT_APP_API_URL || '/api'

	const [formData, setFormData] = useState({
		author: '',
		email: '',
		telephone: '',
		sex: 'male'
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

	useEffect(() => {
		fetch(`${apiUrl}/settings`)
			.then(r => r.json())
			.then(data => {
				if (data) {
					setSettings(data.data || data)
				}
			})
			.catch(console.error)
	}, [apiUrl])

	const validateField = (fieldName, value) => {
		const val = (value || '').trim()
		switch (fieldName) {
			case 'author':
				if (!val) return 'Name is required'
				if (val.length < 2) return 'Name must be at least 2 characters'
				if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Name can only contain letters and spaces'
				return ''
			case 'email':
				if (!val) return 'Email is required'
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address'
				return ''
			case 'telephone': {
				if (!val) return 'Telephone number is required'
				const digits = val.replace(/\D/g, '')
				if (digits.length !== 10) {
					return 'Please enter a valid 10-digit telephone number'
				}
				return ''
			}
			case 'sex':
				if (!val) return 'Please select a gender'
				return ''
			default:
				return ''
		}
	}

	const handleChange = (e) => {
		let { name, value } = e.target
		if (name === 'telephone') {
			value = value.replace(/\D/g, '').slice(0, 10)
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
		const allFields = ['author', 'email', 'telephone', 'sex']
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
			setStatus({ type: 'error', message: 'Please correct the highlighted fields before submitting.' })
			return
		}

		setSubmitting(true)
		setStatus(null)

		try {
			const res = await fetch(`${apiUrl}/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			const data = await res.json()
			if (res.ok && data.success) {
				setStatus({ type: 'success', message: 'Registration submitted successfully! Welcome to SK Sports Academy.' })
				setFormData({ author: '', email: '', telephone: '', sex: 'male' })
				setTouched({})
				setErrors({})
			} else {
				setStatus({ type: 'error', message: data.message || 'Failed to register. Please try again.' })
			}
		} catch (err) {
			console.error('Registration error:', err)
			setStatus({ type: 'error', message: 'Network error. Please try again later.' })
		} finally {
			setSubmitting(false)
		}
	}

	const img = settings?.enquiry_image || "images/badminton-smash.jpg"
	const logo = settings?.logo || "images/logo.png"
	const phone = settings?.phone || "8883422888, 978886004"
	const email = settings?.email || "glowflosports@gmail.com"
	const name = settings?.siteName || "SK Sports Academy"

	return (
		<>
			<div className="widget-form-register">
				<div className="row">
					<div className="col-md-6 pd-form image-register wow fadeInLeft animated">
						<img src={img} alt="SK Sports Academy Badminton" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
					</div>
					<div className="col-md-6 pd-form wow fadeInRight animated">
						<div className="widget-register background-green">
							<div className="heading-register">
								<div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'nowrap' }}>
									<img src={logo} alt="SK Sports Logo" style={{ height: '85px', width: 'auto', flexShrink: 0 }} />
									<h2 className="title-register" style={{ whiteSpace: 'nowrap', fontSize: '32px', lineHeight: '1.2', marginTop: 0 }}>{name}</h2>
								</div>
							</div>
							<div className="list-contact">
								<div className="contact">
									<span> Phone: </span>
									<div className="address">{phone}</div>
								</div>
								<div className="contact">
									<span> Email: </span>
									<div className="address" style={{ textTransform: 'lowercase' }}>{email}</div>
								</div>
							</div>
							<ul className="social-media">
								{settings?.facebook && (
									<li><a href={settings.facebook} target="_blank" rel="noreferrer"><i className="icon-facebook" /></a></li>
								)}
								{settings?.instagram && (
									<li><a href={settings.instagram} target="_blank" rel="noreferrer"><i className="icon-instagram" /></a></li>
								)}
								{settings?.youtube && (
									<li><a href={settings.youtube} target="_blank" rel="noreferrer"><i className="icon-youtube" /></a></li>
								)}
								{(!settings?.facebook && !settings?.instagram && !settings?.youtube) && (
									<>
										<li><Link to="/#"><i className="icon-facebook" /></Link></li>
										<li><Link to="/#"><i className="icon-instagram" /></Link></li>
										<li><Link to="/#"><i className="icon-youtube" /></Link></li>
									</>
								)}
							</ul>
							<div className="form-register">
								{status && (
									<div style={{
										padding: '12px 16px',
										borderRadius: '8px',
										marginBottom: '20px',
										fontSize: '14px',
										fontWeight: '500',
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
										backgroundColor: status.type === 'success' ? '#10b981' : '#ef4444',
										color: '#ffffff',
										boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
									}}>
										<span>{status.type === 'success' ? '✓' : '⚠'}</span>
										<span>{status.message}</span>
									</div>
								)}
								<form id="registerform" className="register-form" onSubmit={handleSubmit} noValidate>
									<fieldset className="name-container">
										<input
											type="text"
											id="author"
											placeholder="Your name*"
											className="tb-my-input"
											name="author"
											tabIndex={1}
											size={32}
											value={formData.author}
											onChange={handleChange}
											onBlur={handleBlur}
											style={{
												borderColor: (errors.author && touched.author) ? '#ef4444' : undefined,
												outlineColor: (errors.author && touched.author) ? '#ef4444' : undefined
											}}
										/>
										{errors.author && touched.author && (
											<span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '4px', fontWeight: 500, backgroundColor: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px' }}>
												{errors.author}
											</span>
										)}
									</fieldset>
									<fieldset className="email-container">
										<input
											type="email"
											id="email"
											placeholder="Your email*"
											className="tb-my-input"
											name="email"
											tabIndex={2}
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
											<span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '4px', fontWeight: 500, backgroundColor: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px' }}>
												{errors.email}
											</span>
										)}
									</fieldset>
									<fieldset className="telephone-container">
										<input
											type="tel"
											id="telephone"
											placeholder="Telephone (10 digits)*"
											className="tb-my-input"
											name="telephone"
											tabIndex={1}
											size={32}
											value={formData.telephone}
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
												borderColor: (errors.telephone && touched.telephone) ? '#ef4444' : undefined,
												outlineColor: (errors.telephone && touched.telephone) ? '#ef4444' : undefined
											}}
										/>
										{errors.telephone && touched.telephone && (
											<span style={{ color: '#ef4444', fontSize: '12px', display: 'block', marginTop: '4px', fontWeight: 500, backgroundColor: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px' }}>
												{errors.telephone}
											</span>
										)}
									</fieldset>
									<fieldset className="sex-container">
										<select
											name="sex"
											id="sexs"
											className="tb-my-input"
											value={formData.sex}
											onChange={handleChange}
										>
											<option value="male">Male</option>
											<option value="female">Female</option>
										</select>
									</fieldset>
									<p className="form-submit" style={{ clear: 'both' }}>
										<button
											name="submit"
											type="submit"
											id="comment-reply"
											className="submit-register"
											disabled={submitting}
											style={{
												opacity: submitting ? 0.7 : 1,
												cursor: submitting ? 'not-allowed' : 'pointer',
												border: 'none'
											}}
										>
											{submitting ? 'Submitting...' : 'Join now'}
										</button>
									</p>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
