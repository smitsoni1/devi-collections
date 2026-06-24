import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../features/users/usersApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { PageLoader } from '../components/Loader';
import Message from '../components/Message';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: profile, isLoading, error } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  useEffect(() => {
    if (profile) {
      setName(profile.name);
    }
  }, [profile]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await updateProfile({
        name,
        password: password || undefined,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <PageLoader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;

  return (
    <div className="section container-max">
      <div className="max-w-xl mx-auto">
        <h1 className="page-title mb-8">My Profile</h1>

        <div className="card p-6 md:p-8">
          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="input bg-gray-100 text-gray-500 cursor-not-allowed"
                value={profile?.email || ''}
                readOnly
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
            </div>

            <div className="divider" />
            <p className="text-sm font-semibold text-gray-700 mb-2">Change Password (Optional)</p>

            <div>
              <label className="label" htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                className="input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
