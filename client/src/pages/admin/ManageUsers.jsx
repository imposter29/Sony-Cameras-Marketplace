import { Users } from 'lucide-react';

const ManageUsers = () => {
  return (
    <div className="sony-container py-10">
      <h1 className="text-3xl font-display font-semibold mb-8">Manage Users</h1>

      <div className="border border-sony-light p-12 text-center">
        <Users size={48} className="mx-auto text-sony-light mb-4" />
        <p className="text-sony-mid text-lg mb-2">User Management</p>
        <p className="text-sm text-sony-mid">
          View registered users and toggle active/inactive status. Ready for feature implementation.
        </p>
      </div>
    </div>
  );
};

export default ManageUsers;
