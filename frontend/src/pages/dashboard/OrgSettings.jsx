import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI, teamAPI } from '../../utils/api';
import SidebarNav from '../../components/SidebarNav';

const Tab = ({ active, children, onClick }) => (
  <button onClick={onClick} className={`px-3 py-2 rounded-md text-sm font-medium border ${active ? 'text-white bg-neutral-800/70 border-neutral-700' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50 border-transparent'}`}>{children}</button>
);

const Radio = ({ checked, onChange }) => (
  <span onClick={() => onChange(!checked)} className={`inline-flex w-4 h-4 items-center justify-center rounded-full border ${checked ? 'border-emerald-500' : 'border-neutral-600'} cursor-pointer`}>{checked ? <span className="w-2 h-2 rounded-full bg-emerald-500"></span> : null}</span>
);

const OrgSettings = () => {
  const navigate = useNavigate();
  const { teamId: teamIdParam } = useParams();
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [privacy, setPrivacy] = useState('disabled');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('general');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const me = await authAPI.getCurrentUser();
        setUser(me?.data?.user);

        let chosenId = teamIdParam;
        if (!chosenId) {
          const my = await teamAPI.myTeams();
          chosenId = my?.data?.teams?.[0]?.team?._id;
          if (chosenId && !teamIdParam) navigate(`/dashboard/org/${chosenId}/settings`, { replace: true });
        }
        if (!chosenId) { setLoading(false); return; }

        const res = await teamAPI.getTeam(chosenId);
        const t = res?.data?.team;
        setTeam(t);
        setForm({ name: t?.name || '', slug: t?.slug || '' });
        setPrivacy(t?.settings?.assistantOptIn || 'disabled');
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdParam]);

  const changedGeneral = useMemo(() => form.name !== (team?.name || '') || form.slug !== (team?.slug || ''), [form, team]);
  const changedPrivacy = useMemo(() => (team?.settings?.assistantOptIn || 'disabled') !== privacy, [privacy, team]);

  const saveGeneral = async () => {
    if (!team?._id || !changedGeneral) return;
    setSaving(true);
    try {
      const r = await teamAPI.updateTeam(team._id, { name: form.name, slug: form.slug });
      const t = r?.data?.team;
      setTeam(t);
      setForm({ name: t.name, slug: t.slug });
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const savePrivacy = async () => {
    if (!team?._id || !changedPrivacy) return;
    setSaving(true);
    try {
      const r = await teamAPI.updateTeam(team._id, { settings: { assistantOptIn: privacy } });
      const t = r?.data?.team;
      setTeam(t);
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const copySlug = async () => {
    try { await navigator.clipboard.writeText(form.slug); } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">No team yet</h1>
          <p className="text-neutral-400 mb-6">Create a team to access organization settings.</p>
          <button onClick={async () => { const name = window.prompt('Name your team'); if (!name) return; const r = await teamAPI.createTeam(name); const id = r?.data?.team?._id; if (id) navigate(`/dashboard/org/${id}/settings`); }} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-semibold">Create team</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="h-12 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">S</div>
            <span className="font-bold text-base tracking-tight">Sellaora</span>
          </div>
          <div className="w-px h-4 bg-neutral-700"></div>
          <div className="text-sm text-neutral-400 font-medium">{team?.name}</div>
          <span className="px-2.5 py-1 bg-neutral-800/80 text-neutral-300 rounded-md text-xs font-semibold border border-neutral-700/50">Free</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800/60 rounded-md text-sm font-medium">Feedback</button>
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-white">{(user?.email?.[0] || 'U').toUpperCase()}</div>
        </div>
      </div>

      <div className="flex">
        <SidebarNav active="org" teamId={team?._id} />

        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Organization Settings</h1>
              <p className="text-neutral-500 text-sm font-medium">Manage your organization's details and data privacy</p>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <Tab active={tab==='general'} onClick={() => setTab('general')}>General</Tab>
            <Tab active={tab==='security'} onClick={() => setTab('security')}>Security</Tab>
            <Tab active={tab==='oauth'} onClick={() => setTab('oauth')}>OAuth Apps</Tab>
            <Tab active={tab==='sso'} onClick={() => setTab('sso')}>SSO</Tab>
            <Tab active={tab==='audit'} onClick={() => setTab('audit')}>Audit Logs</Tab>
            <Tab active={tab==='legal'} onClick={() => setTab('legal')}>Legal Documents</Tab>
          </div>

          {tab === 'general' && (
            <div className="space-y-8">
              <section className="border border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/60 font-semibold">Organization Details</div>
                <div className="p-4 space-y-6">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Organization name</label>
                    <input value={form.name} onChange={(e)=>setForm(f=>({...f, name:e.target.value}))} className="w-full px-3 py-2 bg-neutral-900/80 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"/>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Organization slug</label>
                    <div className="flex items-center gap-2">
                      <input value={form.slug} onChange={(e)=>setForm(f=>({...f, slug:e.target.value}))} className="flex-1 px-3 py-2 bg-neutral-900/80 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"/>
                      <button onClick={copySlug} className="px-3 py-2 rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-800">Copy</button>
                      <button disabled={!changedGeneral || saving} onClick={saveGeneral} className={`px-3 py-2 rounded-lg ${changedGeneral ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-neutral-800 text-neutral-400'} font-semibold`}>{saving ? 'Saving...' : 'Save'}</button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="border border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/60 font-semibold">Data Privacy</div>
                <div className="p-4 space-y-5">
                  <div className="space-y-3">
                    {[{k:'disabled', label:'Disabled', desc:'No data is shared with third-party AI providers.'},{k:'schema_only', label:'Schema Only', desc:"Share schema metadata only (no row data)."},{k:'schema_logs', label:'Schema & Logs', desc:'Share schema and logs with third-party AI providers.'}].map(opt => (
                      <label key={opt.k} className="flex items-start gap-3 cursor-pointer">
                        <Radio checked={privacy===opt.k} onChange={()=>setPrivacy(opt.k)} />
                        <div>
                          <div className="text-sm font-medium">{opt.label}</div>
                          <div className="text-xs text-neutral-400">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="pt-2">
                    <button disabled={!changedPrivacy || saving} onClick={savePrivacy} className={`px-3 py-2 rounded-lg ${changedPrivacy ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-neutral-800 text-neutral-400'} font-semibold`}>{saving ? 'Saving...' : 'Save'}</button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {tab !== 'general' && (
            <div className="p-10 text-center text-neutral-500 border border-neutral-800 rounded-xl">Section coming soon</div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-950/50 border border-red-900 rounded-lg"><p className="text-red-400 text-sm">{error}</p></div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OrgSettings;