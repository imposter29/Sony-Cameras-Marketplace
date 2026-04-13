import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Search, ShieldCheck, ShieldOff } from 'lucide-react';
import { getAllUsers, toggleUserActive } from '../../api/users';
import { useToast } from '../../components/ui/Toast';

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => getAllUsers().then(r => r.data),
  });
  const users = data?.users || [];

  const toggleMutation = useMutation({
    mutationFn: (id) => toggleUserActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      addToast('✓ User status updated');
    },
    onError: () => addToast('✗ Failed to update user'),
  });

  const filtered = users.filter(u => {
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchSearch = !search
      || u.name?.toLowerCase().includes(search.toLowerCase())
      || u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const inputStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: '12px', border: '0.5px solid #E5E5E5',
    padding: '10px 14px', outline: 'none', backgroundColor: '#fff', color: '#000',
  };

  const totalActive = users.filter(u => u.isActive).length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 500, color: '#000' }}>Manage Users</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginTop: '4px' }}>
            {users.length} total · {totalActive} active · {totalAdmins} admin{totalAdmins !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', stroke: '#7F7F7F' }} />
            <input
              placeholder="Search by name or email..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <select
            value={filterRole} onChange={e => setFilterRole(e.target.value)}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '24px', minWidth: '140px' }}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: '#fff', border: '0.5px solid #E5E5E5' }}>
          {/* Head */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 80px 100px 100px', borderBottom: '0.5px solid #E5E5E5', padding: '12px 20px' }}>
            {['User', 'Email', 'Role', 'Status', 'Action'].map(h => (
              <span key={h} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7F7F7F' }}>{h}</span>
            ))}
          </div>

          {isLoading ? (
            [1,2,3,4,5].map(i => <div key={i} className="animate-pulse" style={{ height: '64px', borderBottom: '0.5px solid #F0F0F0', backgroundColor: '#FAFAFA' }} />)
          ) : filtered.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Users size={36} stroke="#E5E5E5" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F' }}>No users found</p>
            </div>
          ) : filtered.map(user => (
            <div key={user._id} style={{ display: 'grid', gridTemplateColumns: '1fr 200px 80px 100px 100px', alignItems: 'center', padding: '14px 20px', borderBottom: '0.5px solid #F0F0F0', opacity: user.isActive ? 1 : 0.55 }}>
              {/* Name + avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#fff' }}>{(user.name || '?')[0].toUpperCase()}</span>
                  }
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#000' }}>{user.name}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', marginTop: '1px' }}>
                    Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Email */}
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>{user.email}</p>

              {/* Role badge */}
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                border: `0.5px solid ${user.role === 'admin' ? '#000' : '#E5E5E5'}`,
                color: user.role === 'admin' ? '#000' : '#7F7F7F',
                padding: '3px 8px', display: 'inline-block',
              }}>
                {user.role}
              </span>

              {/* Status */}
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                border: `0.5px solid ${user.isActive ? '#10B981' : '#EF4444'}`,
                color: user.isActive ? '#10B981' : '#EF4444',
                padding: '3px 8px', display: 'inline-block',
              }}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>

              {/* Toggle Button — skip for admins to prevent lockout */}
              {user.role !== 'admin' ? (
                <button
                  onClick={() => toggleMutation.mutate(user._id)}
                  disabled={toggleMutation.isPending}
                  title={user.isActive ? 'Deactivate user' : 'Activate user'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                    border: `0.5px solid ${user.isActive ? '#EF4444' : '#10B981'}`,
                    color: user.isActive ? '#EF4444' : '#10B981',
                    backgroundColor: 'transparent', padding: '5px 10px', cursor: 'pointer',
                  }}
                >
                  {user.isActive
                    ? <><ShieldOff size={10} /> Deactivate</>
                    : <><ShieldCheck size={10} /> Activate</>
                  }
                </button>
              ) : (
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', color: '#C0C0C0' }}>Protected</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
