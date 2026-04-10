import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { useToast } from '../../components/ui/Toast';

const ManageMessages = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: () => api.get('/contact').then((r) => r.data),
  });

  const markRead = useMutation({
    mutationFn: (id) => api.patch(`/contact/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contact-messages'] }),
  });

  const deleteMsg = useMutation({
    mutationFn: (id) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      setSelected(null);
      addToast('✓ Message deleted');
    },
  });

  const handleOpen = (msg) => {
    setSelected(msg);
    if (!msg.read) markRead.mutate(msg._id);
  };

  const messages = data?.messages || [];
  const unread = messages.filter((m) => !m.read).length;

  const lbl = { fontFamily: "'DM Sans', sans-serif", fontSize: '9px', color: '#7F7F7F', textTransform: 'uppercase', letterSpacing: '0.12em' };
  const cell = { fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#000', padding: '14px 12px', borderBottom: '0.5px solid #F0F0F0', verticalAlign: 'middle' };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>Contact Messages</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F' }}>
            {messages.length} total · <span style={{ color: '#000', fontWeight: 600 }}>{unread} unread</span>
          </p>
        </div>
        <button onClick={() => navigate('/admin')} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'none', border: 'none', color: '#7F7F7F', cursor: 'pointer' }}>
          ← Admin Dashboard
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '24px' }}>
        {/* Messages list */}
        <div style={{ border: '0.5px solid #E5E5E5' }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              {[0, 1, 2].map(i => <div key={i} style={{ height: '48px', backgroundColor: '#F5F5F5', marginBottom: '8px' }} />)}
            </div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '60px 40px', textAlign: 'center' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F' }}>No messages yet.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #E5E5E5', backgroundColor: '#FAFAFA' }}>
                  <th style={{ ...cell, ...lbl, textAlign: 'left' }}>Status</th>
                  <th style={{ ...cell, ...lbl, textAlign: 'left' }}>From</th>
                  <th style={{ ...cell, ...lbl, textAlign: 'left' }}>Subject</th>
                  <th style={{ ...cell, ...lbl, textAlign: 'left' }}>Date</th>
                  <th style={{ ...cell, ...lbl, textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    onClick={() => handleOpen(msg)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selected?._id === msg._id ? '#F9F9F9' : msg.read ? '#fff' : '#FAFFF9',
                    }}
                  >
                    <td style={cell}>
                      <span style={{
                        display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%',
                        backgroundColor: msg.read ? '#E5E5E5' : '#000',
                      }} />
                    </td>
                    <td style={{ ...cell, fontWeight: msg.read ? 400 : 600 }}>
                      <div>{msg.name}</div>
                      <div style={{ fontSize: '10px', color: '#7F7F7F' }}>{msg.email}</div>
                    </td>
                    <td style={{ ...cell, color: msg.read ? '#7F7F7F' : '#000' }}>{msg.subject || 'General Enquiry'}</td>
                    <td style={{ ...cell, color: '#7F7F7F', whiteSpace: 'nowrap' }}>
                      {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={cell} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => deleteMsg.mutate(msg._id)}
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Message detail panel */}
        {selected && (
          <div style={{ border: '0.5px solid #E5E5E5', padding: '28px', position: 'sticky', top: '80px', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 500, color: '#000' }}>{selected.subject || 'General Enquiry'}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginTop: '4px' }}>
                  From <strong style={{ color: '#000' }}>{selected.name}</strong> · {selected.email}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#BDBDBD', marginTop: '2px' }}>
                  {new Date(selected.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#7F7F7F' }}
              >
                ×
              </button>
            </div>
            <div style={{ borderTop: '0.5px solid #E5E5E5', paddingTop: '20px' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#000', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </p>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Enquiry'}`}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: '#000', color: '#fff', padding: '10px 20px', textDecoration: 'none', display: 'inline-block' }}
              >
                REPLY VIA EMAIL
              </a>
              <button
                onClick={() => deleteMsg.mutate(selected._id)}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: 'transparent', color: '#000', border: '0.5px solid #000', padding: '10px 20px', cursor: 'pointer' }}
              >
                DELETE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMessages;
