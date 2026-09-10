import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Dumbbell, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('admin@sksports.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // one deliberate entrance beat — nothing else animates on its own after this
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      toast.error(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sk-login-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes sk-sweep {
          from { transform: translateX(-120%) skewX(-12deg); }
          to   { transform: translateX(320%) skewX(-12deg); }
        }
        @keyframes sk-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sk-panel-in {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .sk-login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          background: #0b0d10;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .sk-brand {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px;
          background:
            linear-gradient(180deg, rgba(11,13,16,0.2), rgba(11,13,16,0.85)),
            #14171a;
        }

        .sk-brand::before {
          content: '';
          position: absolute;
          inset: -20% -10%;
          background-image:
            repeating-linear-gradient(
              115deg,
              rgba(255,255,255,0.035) 0px,
              rgba(255,255,255,0.035) 1px,
              transparent 1px,
              transparent 64px
            );
        }

        .sk-sweep-bar {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 30%;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.16), transparent);
          animation: sk-sweep 1.4s ease-out 0.2s both;
        }

        .sk-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f97316, #c2410c);
          margin-bottom: 24px;
          opacity: 0;
          animation: sk-rise 0.6s ease-out 0.15s forwards;
        }

        .sk-eyebrow {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-weight: 500;
          font-size: 12.5px;
          letter-spacing: 0.03em;
          color: #f97316;
          margin: 0 0 10px;
          opacity: 0;
          animation: sk-rise 0.6s ease-out 0.28s forwards;
        }

        .sk-headline {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(32px, 3.6vw, 46px);
          line-height: 1.16;
          letter-spacing: -0.01em;
          color: #f6f5f3;
          margin: 0 0 16px;
          max-width: 11ch;
          opacity: 0;
          animation: sk-rise 0.6s ease-out 0.38s forwards;
        }

        .sk-sub {
          font-size: 15px;
          line-height: 1.6;
          color: #9aa1ab;
          max-width: 40ch;
          margin: 0;
          opacity: 0;
          animation: sk-rise 0.6s ease-out 0.48s forwards;
        }

        .sk-stats {
          display: flex;
          gap: 36px;
          margin-top: 38px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
          opacity: 0;
          animation: sk-rise 0.6s ease-out 0.58s forwards;
        }

        .sk-stat-num {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: #f6f5f3;
        }

        .sk-stat-label {
          font-size: 12.5px;
          color: #767d87;
          margin-top: 2px;
        }

        .sk-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
          background: #fbfaf8;
        }

        .sk-form-wrap {
          width: 100%;
          max-width: 360px;
          opacity: 0;
          transform: translateX(-24px);
        }

        .sk-form-wrap.mounted {
          animation: sk-panel-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }

        .sk-form-title {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-weight: 600;
          font-size: 24px;
          color: #16181c;
          margin: 0 0 6px;
        }

        .sk-form-hint {
          font-size: 13.5px;
          color: #8b9099;
          margin: 0 0 30px;
        }

        .sk-field-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: #4a5057;
          margin-bottom: 7px;
        }

        .sk-field {
          position: relative;
          margin-bottom: 18px;
        }

        .sk-field-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #a8adb5;
          pointer-events: none;
        }

        .sk-input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px 12px 40px;
          border-radius: 9px;
          border: 1.5px solid #e4e1db;
          background: #fff;
          font-size: 14.5px;
          color: #16181c;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .sk-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 3.5px rgba(249,115,22,0.14);
        }

        .sk-input::placeholder {
          color: #b7bcc3;
        }

        .sk-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 0;
          margin-top: 8px;
          border-radius: 9px;
          border: none;
          background: linear-gradient(135deg, #f97316, #dc5f0e);
          color: #fff;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(220,95,14,0.28);
          transition: transform 0.12s ease, box-shadow 0.15s ease, filter 0.15s ease;
        }

        .sk-submit:disabled {
          cursor: not-allowed;
          filter: saturate(0.7);
          box-shadow: none;
        }

        .sk-submit:not(:disabled):active {
          transform: scale(0.98);
        }

        .sk-footnote {
          margin-top: 22px;
          font-size: 12px;
          color: #a8adb5;
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .sk-sweep-bar,
          .sk-mark,
          .sk-eyebrow,
          .sk-headline,
          .sk-sub,
          .sk-stats,
          .sk-form-wrap.mounted {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        @media (max-width: 860px) {
          .sk-login-root {
            grid-template-columns: 1fr;
          }
          .sk-brand {
            padding: 44px 32px 36px;
          }
          .sk-stats {
            display: none;
          }
        }
      `}</style>

      <div className="sk-brand">
        <div className="sk-sweep-bar" aria-hidden="true" />
        <div className="sk-mark">
          <Dumbbell size={22} color="#fff" />
        </div>
        <p className="sk-eyebrow">SK Sports — Admin</p>
        <h1 className="sk-headline">Run the floor from one dashboard.</h1>
        <p className="sk-sub">
          Inventory, orders and coaching schedules, all in one place built for
          how the shop actually moves.
        </p>
        <div className="sk-stats">
          <div>
            <div className="sk-stat-num">24/7</div>
            <div className="sk-stat-label">Order tracking</div>
          </div>
          <div>
            <div className="sk-stat-num">Live</div>
            <div className="sk-stat-label">Stock sync</div>
          </div>
          <div>
            <div className="sk-stat-num">1-tap</div>
            <div className="sk-stat-label">Approvals</div>
          </div>
        </div>
      </div>

      <div className="sk-panel">
        <div className={`sk-form-wrap${mounted ? ' mounted' : ''}`}>
          <h2 className="sk-form-title">Sign in</h2>
          <p className="sk-form-hint">Enter your admin credentials to continue.</p>

          <form onSubmit={submit}>
            <div className="sk-field">
              <label className="sk-field-label" htmlFor="sk-email">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} className="sk-field-icon" />
                <input
                  id="sk-email"
                  className="sk-input"
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="sk-field" style={{ marginBottom: 6 }}>
              <label className="sk-field-label" htmlFor="sk-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} className="sk-field-icon" />
                <input
                  id="sk-password"
                  className="sk-input"
                  type="password"
                  value={password}
                  required
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="sk-submit" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ArrowRight size={16} />
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="sk-footnote">
            Secure admin portal.
          </p>
        </div>
      </div>
    </div>
  )
}