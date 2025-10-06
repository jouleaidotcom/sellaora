import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI, teamAPI } from '../../utils/api';
import TeamInviteModal from '../../components/TeamInviteModal';

const Avatar = ({ name = '', email = '' }) => {
  const label = (name || email || 'U')[0]?.toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-semibold text-neutral-200">
      {label}
    </div>
  );
};

const RoleBadge = ({ role }) => {
  const map = {
    owner: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    admin: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    member: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[role] || map.member}`}>{role}</span>;
};

const MfaIcon = ({ enabled }) => (
  <div className="flex items-center justify-center">
    {enabled ? (
      <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
    ) : (
      <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    )}
  </div>
);

const TeamPage = () => {
  const navigate = useNavigate();
  const { teamId: teamIdParam } = useParams();
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const me = await authAPI.getCurrentUser();
        setUser(me?.data?.user);

        let chosenTeamId = teamIdParam;
        if (!chosenTeamId) {
          const my = await teamAPI.myTeams();
          const first = my?.data?.teams?.[0]?.team?._id;
          chosenTeamId = first;
          if (!teamIdParam && first) {
            navigate(`/dashboard/team/${first}`, { replace: true });
          }
          if (!first) {
            setLoading(false);
            return;
          }
        }

        await loadMembers(chosenTeamId);
      } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdParam]);

  const loadMembers = async (id) => {
    const res = await teamAPI.listMembers(id);
    setTeam(res?.data?.team);
    setMembers(res?.data?.members || []);
  };

  const meId = user?._id;
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter(m =>
      (m.user?.name || '').toLowerCase().includes(q) ||
      (m.user?.email || '').toLowerCase().includes(q)
    );
  }, [members, search]);

  const myRow = members.find(m => String(m.userId) === String(meId));

  const onInvite = async ({ email, role }) => {
    if (!team?._id) return;
    const r = await teamAPI.invite(team._id, { email, role });
    return r; // modal handles success toast
  };

  const leaveTeam = async () => {
    if (!team?._id || !meId) return;
    if (!window.confirm('Leave this team?')) return;
    await teamAPI.removeMember(team._id, meId);
    navigate('/dashboard');
  };

  const createTeam = async () => {
    const name = window.prompt('Name your team');
    if (!name) return;
    const r = await teamAPI.createTeam(name);
    const id = r?.data?.team?._id;
    if (id) navigate(`/dashboard/team/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">No team yet</h1>
          <p className="text-neutral-400 mb-6">Create a team to invite collaborators.</p>
          <button onClick={createTeam} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-semibold">Create team</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Top Navigation (mirrors Dashboard) */}
      <div className="h-12 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">S</div>
            <span className="font-bold text-base tracking-tight">Sellaora</span>
          </div>
          <div className="w-px h-4 bg-neutral-700"></div>
          <div className="text-sm text-neutral-400 font-medium">{team?.name || 'Your Team'}</div>
          <span className="px-2.5 py-1 bg-neutral-800/80 text-neutral-300 rounded-md text-xs font-semibold border border-neutral-700/50">Free</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800/60 rounded-md text-sm font-medium transition-all" onClick={() => window.open('#','_blank')}>Feedback</button>
          <button className="w-8 h-8 rounded-md bg-neutral-800/60 hover:bg-neutral-700/80 border border-neutral-700/50 flex items-center justify-center transition-all group">
            <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-md bg-neutral-800/60 hover:bg-neutral-700/80 border border-neutral-700/50 flex items-center justify-center transition-all group">
            <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
            {(user?.email?.[0] || 'U').toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar (mirrors Dashboard) */}
        <aside className="w-52 border-r border-neutral-800 bg-neutral-900/30 min-h-[calc(100vh-48px)] p-3">
          <nav className="space-y-0.5">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Store</span>
            </button>
            <button 
              onClick={() => navigate('/dashboard/team')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-neutral-800/80 text-white border border-neutral-700/50 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Team</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              <span>Integrations</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Usage</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Billing</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              <span>Organization settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Team</h1>
              <p className="text-neutral-500 text-sm font-medium">Manage access for your organization</p>
            </div>
            <div className="flex items-center gap-2">
              <a href="#" className="px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800/60 rounded-lg text-sm font-medium border border-neutral-800">Docs</a>
              <button onClick={() => setInviteOpen(true)} className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all">Invite member</button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter members" className="pl-10 pr-4 py-2.5 bg-neutral-900/80 border border-neutral-800 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 w-80 transition-all font-medium"/>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <div className="grid grid-cols-[1fr_140px_160px_120px] items-center px-4 py-2 text-xs uppercase tracking-wide text-neutral-400 bg-neutral-900/60">
              <div>User</div>
              <div className="text-center">Enabled MFA</div>
              <div>Role</div>
              <div></div>
            </div>
            <div>
              {filtered.map((m, idx) => (
                <div key={String(m.userId) + idx} className="grid grid-cols-[1fr_140px_160px_120px] items-center px-4 py-3 border-t border-neutral-900 hover:bg-neutral-900/40">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.user?.name} email={m.user?.email} />
                    <div>
                      <div className="text-sm font-medium">{m.user?.email}</div>
                      {m.isYou && <span className="inline-block text-xs text-neutral-400">You</span>}
                    </div>
                  </div>
                  <div className="text-center">
                    <MfaIcon enabled={m.mfaEnabled} />
                  </div>
                  <div>
                    <RoleBadge role={m.role} />
                  </div>
                  <div className="text-right">
                    {m.isYou ? (
                      <button onClick={leaveTeam} className="px-3 py-1.5 text-sm rounded-md border border-neutral-800 text-neutral-300 hover:bg-neutral-800">Leave team</button>
                    ) : (
                      <button onClick={async () => { await teamAPI.removeMember(team._id, m.userId); await loadMembers(team._id); }} className="px-3 py-1.5 text-sm rounded-md border border-neutral-800 text-neutral-300 hover:bg-neutral-800">Remove</button>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-10 text-center text-neutral-500">No members</div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-950/50 border border-red-900 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </main>
      </div>

      <TeamInviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={onInvite} />
    </div>
  );
};

export default TeamPage;
