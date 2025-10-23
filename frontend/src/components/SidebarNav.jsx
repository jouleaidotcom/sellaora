import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamAPI } from '../utils/api';
import { useState } from 'react';


const Item = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${active ? 'bg-neutral-800/80 text-white border border-neutral-700/50 shadow-sm' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all'}`}>
    {children}
  </button>
);

const Icon = ({ d, extra }) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    {extra ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={extra} /> : null}
  </svg>
);

const SidebarNav = ({ active = 'store', teamId }) => {
  const navigate = useNavigate();
 const [logo, setLogo] = useState(() => localStorage.getItem('sidebarLogo'));

const handleLogoUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result);
      localStorage.setItem('sidebarLogo', reader.result);
    };
    reader.readAsDataURL(file);
  }
};



  const goOrgSettings = useCallback(async () => {
    if (teamId) { navigate(`/dashboard/org/${teamId}/settings`); return; }
    try {
      const my = await teamAPI.myTeams();
      const firstId = my?.data?.teams?.[0]?.team?._id;
      if (firstId) navigate(`/dashboard/org/${firstId}/settings`);
      else navigate('/dashboard/team');
    } catch {
      navigate('/dashboard/team');
    }
  }, [navigate, teamId]);

  return (
  <aside className="w-56 border-r border-neutral-800 bg-neutral-900/30 min-h-[calc(100vh-48px)] p-3 flex flex-col items-center">
    
    {/*  Logo Section */}
    <div className="logo-section mb-4 text-center w-full">
      {logo ? (
        <img
          src={logo}
          alt="Logo"
          className="h-12 w-12 object-contain mx-auto rounded-md mb-2"
        />
      ) : (
        <h2 className="text-lg font-medium text-neutral-300 mb-2">Add a Logo</h2>

      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="text-xs text-gray-400 w-full cursor-pointer"
      />
    </div>

    {/* Navigation Items */}
    <nav className="space-y-0.5 w-full">
      <Item active={active==='store'} onClick={() => navigate('/dashboard')}>
        <Icon d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        <span>Store</span>
      </Item>

      <Item active={active==='team'} onClick={() => navigate(teamId ? `/dashboard/team/${teamId}` : '/dashboard/team')}>
        <Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        <span>Team</span>
      </Item>

      <Item active={active==='integrations'} onClick={() => {}}>
        <Icon d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        <span>Integrations</span>
      </Item>

      <Item active={active==='usage'} onClick={() => {}}>
        <Icon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        <span>Usage</span>
      </Item>

      <Item active={active==='billing'} onClick={() => {}}>
        <Icon d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        <span>Billing</span>
      </Item>

      <Item active={active==='org'} onClick={goOrgSettings}>
        <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37" extra="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <span className="whitespace-nowrap">Organization settings</span>
      </Item>
    </nav>
  </aside>
);

};

export default SidebarNav;