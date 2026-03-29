import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus } from 'lucide-react';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../api/users';

const emptyForm = {
  label: 'Home',
  line1: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
};

const Addresses = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch addresses
  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await getAddresses();
      return res.data;
    },
  });

  const addresses = data?.addresses || data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr._id);
    setForm({
      label: addr.label || 'Home',
      line1: addr.line1 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      phone: addr.phone || '',
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrorMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.line1 || !form.city || !form.state || !form.pincode) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    try {
      setSaving(true);
      setErrorMsg('');
      if (editingId) {
        await updateAddress(editingId, form);
      } else {
        await addAddress(form);
      }
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      closeModal();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    deleteMutation.mutate(id);
  };

  const handleSetDefault = async (id) => {
    try {
      await updateAddress(id, { isDefault: true });
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    } catch (err) {
      console.error('Failed to set default', err);
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="sony-container py-10">
        {/* Page title */}
        <h1
          className="mb-8"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px',
            fontWeight: 600,
            color: '#000000',
          }}
        >
          Your addresses
        </h1>

        {/* Add new address button */}
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-6 py-3 mb-8 transition-opacity hover:opacity-70"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            color: '#000000',
            backgroundColor: '#FFFFFF',
            border: '1px solid #000000',
            borderRadius: '0',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          <Plus size={14} />
          <span>Add new address</span>
        </button>

        {/* Address list */}
        {isLoading ? (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: '#7F7F7F',
            }}
          >
            Loading addresses...
          </p>
        ) : addresses.length === 0 ? (
          <div
            className="text-center py-16"
            style={{ border: '0.5px solid #000000' }}
          >
            <MapPin
              size={48}
              className="mx-auto mb-4"
              style={{ color: '#E5E5E5' }}
            />
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                color: '#7F7F7F',
                marginBottom: '4px',
              }}
            >
              No addresses saved yet
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                color: '#7F7F7F',
              }}
            >
              Add your first shipping address using the button above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="p-5"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '0.5px solid #000000',
                  borderRadius: '0',
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    {/* Label badge */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className="inline-block px-2 py-0.5"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          backgroundColor: '#404040',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {addr.label || 'Home'}
                      </span>
                      {addr.isDefault && (
                        <span
                          className="inline-block px-2 py-0.5"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '9px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            backgroundColor: '#000000',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Default
                        </span>
                      )}
                    </div>

                    {/* Address details */}
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '14px',
                        color: '#000000',
                        marginBottom: '2px',
                      }}
                    >
                      {addr.line1}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '14px',
                        color: '#404040',
                      }}
                    >
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                    {addr.phone && (
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '13px',
                          color: '#7F7F7F',
                          marginTop: '4px',
                        }}
                      >
                        {addr.phone}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => openEditModal(addr)}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '12px',
                        color: '#7F7F7F',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '12px',
                        color: '#7F7F7F',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Set as default */}
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr._id)}
                    className="mt-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#000000',
                      background: 'none',
                      border: '1px solid #000000',
                      borderRadius: '0',
                      padding: '4px 12px',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={closeModal}
          />

          {/* Modal box */}
          <div
            className="relative w-full max-w-lg mx-4 p-6"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '0',
            }}
          >
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '20px',
                fontWeight: 600,
                color: '#000000',
              }}
            >
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>

            {errorMsg && (
              <p
                className="mb-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  color: '#7F7F7F',
                }}
              >
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Label */}
              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  Label
                </label>
                <select
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-4 py-3 outline-none"
                  style={inputStyle}
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Line 1 */}
              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  className="w-full px-4 py-3 outline-none"
                  style={inputStyle}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-3 outline-none"
                  style={inputStyle}
                  placeholder="Mumbai"
                  required
                />
              </div>

              {/* State */}
              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  State
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-3 outline-none"
                  style={inputStyle}
                  placeholder="Maharashtra"
                  required
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  Pincode
                </label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full px-4 py-3 outline-none"
                  style={inputStyle}
                  placeholder="400001"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  Phone
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 outline-none"
                  style={inputStyle}
                  placeholder="+91 9876543210"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center space-x-4 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 transition-opacity disabled:opacity-50"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    backgroundColor: '#000000',
                    border: 'none',
                    borderRadius: '0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'Saving...' : 'SAVE ADDRESS'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-3 transition-opacity hover:opacity-70"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#000000',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #000000',
                    borderRadius: '0',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
