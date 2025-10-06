import { useState } from 'react';

const TeamInviteModal = ({ open, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) {
      setError('Please enter an email');
      return;
    }
    try {
      setSubmitting(true);
      const res = await onInvite({ email, role });
      if (res?.success !== false) {
        setSuccess('Invite sent');
        setEmail('');
        setRole('member');
      }
    } catch (err) {
      setError(err.message || 'Failed to send invite');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Invite member</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">✕</button>
        </div>
        {error && (
          <div className="mb-3 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded p-2">{error}</div>
        )}
        {success && (
          <div className="mb-3 text-sm text-emerald-400 bg-emerald-950/30 border border-emerald-900 rounded p-2">{success}</div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-neutral-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-neutral-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-800">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50">{submitting ? 'Sending...' : 'Send invite'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamInviteModal;
