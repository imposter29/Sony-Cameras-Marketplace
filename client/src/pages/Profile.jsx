import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { updateProfile } from '../api/users';

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Edit name state
  const [name, setName] = useState(user?.name || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMessage, setNameMessage] = useState('');

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState('');

  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

  const initials = user?.name
    ? user.name.charAt(0).toUpperCase()
    : '?';

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setNameSaving(true);
      setNameMessage('');
      const { data } = await updateProfile({ name: name.trim() });
      setUser(data.user || { ...user, name: name.trim() });
      setNameMessage('Name updated successfully');
    } catch (err) {
      setNameMessage(err.response?.data?.message || 'Failed to update name');
    } finally {
      setNameSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPwMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPwMessage('New password must be at least 6 characters');
      return;
    }
    try {
      setPwSaving(true);
      setPwMessage('');
      await updateProfile({ currentPassword, newPassword });
      setPwMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPwMessage(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwSaving(false);
    }
  };

  const inputStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#000000',
    border: '1px solid #000000',
    borderRadius: '0',
    backgroundColor: '#FFFFFF',
  };

  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    fontWeight: 500,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const buttonStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    color: '#FFFFFF',
    backgroundColor: '#000000',
    border: 'none',
    borderRadius: '0',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="sony-container py-10">
        {/* Page title */}
        <h1
          className="mb-10"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px',
            fontWeight: 600,
            color: '#000000',
          }}
        >
          Profile
        </h1>

        {/* Avatar + info */}
        <div className="flex flex-col items-center mb-12">
          <div
            className="flex items-center justify-center mb-4"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#000000',
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '28px',
                fontWeight: 600,
                color: '#FFFFFF',
              }}
            >
              {initials}
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px',
              fontWeight: 600,
              color: '#000000',
              marginBottom: '4px',
            }}
          >
            {user?.name}
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: '#7F7F7F',
            }}
          >
            {user?.email}
          </p>
        </div>

        <div className="max-w-lg mx-auto space-y-12">
          {/* Edit Name Section */}
          <div>
            <h3
              className="mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#000000',
              }}
            >
              Edit Name
            </h3>
            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 outline-none"
                  style={inputStyle}
                />
              </div>
              {nameMessage && (
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    color: '#7F7F7F',
                  }}
                >
                  {nameMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={nameSaving}
                className="px-8 py-3 transition-opacity disabled:opacity-50"
                style={buttonStyle}
              >
                {nameSaving ? 'Saving...' : 'SAVE CHANGES'}
              </button>
            </form>
          </div>

          {/* Divider */}
          <hr style={{ borderColor: '#E5E5E5' }} />

          {/* Change Password Section */}
          <div>
            <h3
              className="mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#000000',
              }}
            >
              Change Password
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 outline-none"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 outline-none"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 outline-none"
                  style={inputStyle}
                  required
                />
              </div>
              {pwMessage && (
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    color: '#7F7F7F',
                  }}
                >
                  {pwMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={pwSaving}
                className="px-8 py-3 transition-opacity disabled:opacity-50"
                style={buttonStyle}
              >
                {pwSaving ? 'Updating...' : 'UPDATE PASSWORD'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
