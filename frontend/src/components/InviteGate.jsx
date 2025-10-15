import { useEffect, useState } from 'react'

export default function InviteGate({ onVerified, variant = 'card' }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inviteCode = import.meta.env.VITE_INVITE_CODE

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const q = params.get('invite')
      if (q) {
        setCode(q)
        if (inviteCode && q.trim() === String(inviteCode)) {
          sessionStorage.setItem('inviteVerified', 'true')
          onVerified?.()
        }
      }
    } catch {}
    if (!inviteCode) {
      try { console.warn('InviteGate: VITE_INVITE_CODE is not set. Invites are closed.') } catch {}
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!inviteCode) return
    setLoading(true)
    setTimeout(() => {
      if (code.trim() === String(inviteCode)) {
        try { sessionStorage.setItem('inviteVerified', 'true') } catch {}
        onVerified?.()
      } else {
        setError('That code didn’t work. Double‑check and try again.')
      }
      setLoading(false)
    }, 200)
  }

  if (variant === 'inline') {
    return (
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={inviteCode ? 'Enter invite code' : 'Invites closed'}
            disabled={!inviteCode || loading}
            className="flex-1 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!inviteCode || loading || !code.trim()}
            className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 transition disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Unlock'}
          </button>
        </form>
        {error && (
          <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
        )}
        {!inviteCode && (
          <p className="mt-2 text-xs text-neutral-400 text-center">Invites are currently closed.</p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 w-full max-w-md mx-auto text-left">
      <div className="mb-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Private beta
        </div>
        <h3 className="mt-3 text-base font-medium">Enter your invite code</h3>
        <p className="mt-1 text-sm text-neutral-400">Access is currently invite‑only.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={inviteCode ? 'Invite code' : 'Invites closed'}
          disabled={!inviteCode || loading}
          className="flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!inviteCode || loading || !code.trim()}
          className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 transition disabled:opacity-60"
        >
          {loading ? 'Checking…' : 'Continue'}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
      {!inviteCode && (
        <p className="mt-2 text-xs text-neutral-400">Invites are not configured for this deployment.</p>
      )}
    </div>
  )
}
