import { useState } from 'react';
import { FiTrash2, FiShield, FiUser } from 'react-icons/fi';
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from '../../features/users/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

export default function UserListScreen() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAllUsersQuery({ page });
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove customer "${name}"?`)) return;
    try {
      await deleteUser(id).unwrap();
      toast.success('User removed');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleAdmin = async (user) => {
    const newRoles = user.roles.includes('admin')
      ? user.roles.filter((r) => r !== 'admin')
      : [...user.roles, 'admin'];
    if (!window.confirm(`${newRoles.includes('admin') ? 'Grant' : 'Revoke'} admin access for "${user.name}"?`)) return;
    try {
      await updateUser({ id: user._id, roles: newRoles }).unwrap();
      toast.success(`Admin access ${newRoles.includes('admin') ? 'granted' : 'revoked'}`);
    } catch {
      toast.error('Failed to update user');
    }
  };

  return (
    <div>
      <h1 className="page-title text-2xl mb-8">Customers</h1>

      {isLoading ? <Loader /> : isError ? (
        <Message type="error">Failed to load users</Message>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-elevated">
                    {['Customer', 'Email', 'Joined', 'Role', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {data?.users?.map((user) => (
                    <tr key={user._id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-900 font-medium text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{user.email}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        {user.roles.includes('admin')
                          ? <span className="badge-brand text-xs">Admin</span>
                          : <span className="badge text-xs bg-surface-elevated border border-surface-border text-gray-600">Customer</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleAdmin(user)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                              user.roles.includes('admin')
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                : 'bg-brand-500/10 border-brand-500/20 text-brand-400 hover:bg-brand-500/20'
                            }`}
                          >
                            <FiShield className="w-3 h-3" />
                            {user.roles.includes('admin') ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          {!user.roles.includes('admin') && (
                            <button
                              onClick={() => handleDelete(user._id, user.name)}
                              className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data?.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-brand-gradient text-white' : 'bg-surface-card border border-surface-border text-gray-600 hover:border-brand-600'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
