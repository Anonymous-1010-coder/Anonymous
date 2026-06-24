'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/layout';
import { api } from '@/lib/api';

interface DeviceInfo {
  id: number;
  ip: string | null;
  userAgent: string | null;
  platform: string | null;
  language: string | null;
  timezone: string | null;
  screenWidth: number | null;
  screenHeight: number | null;
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  connectionType: string | null;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  touchSupported: boolean | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  user: { id: number; username: string; email: string; role: string };
}

interface ManagedUser {
  id: number;
  username: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: string;
  _count: { apps: number };
}

export default function AdminPage() {
  const { user: authUser, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'devices' | 'users'>('devices');
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', password: '' });
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [addForm, setAddForm] = useState({ username: '', email: '', password: '' });
  const [adding, setAdding] = useState(false);

  const isSuper = authUser?.role === 'superadmin';

  useEffect(() => {
    if (!loading && (!authUser || (authUser.role !== 'admin' && authUser.role !== 'superadmin'))) {
      router.push('/dashboard');
    }
  }, [authUser, loading, router]);

  useEffect(() => {
    if (!authUser) return;
    setFetching(true);
    setError('');

    const promises: Promise<any>[] = [api.device.getAll()];
    if (isSuper) promises.push(api.admin.listUsers());

    Promise.all(promises)
      .then(([deviceData, userData]) => {
        setDevices(deviceData);
        if (userData) setUsers(userData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [authUser, isSuper]);

  if (loading || !authUser || (authUser.role !== 'admin' && authUser.role !== 'superadmin')) return null;

  const formatDate = (d: string) => new Date(d).toLocaleString();

  const handleRoleChange = async (userId: number, role: string) => {
    try {
      const updated = await api.admin.updateRole(userId, role);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updated.role } : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleBan = async (userId: number) => {
    try {
      const updated = await api.admin.toggleBan(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, banned: updated.banned } : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const user = await api.admin.createUser(addForm);
      setUsers(prev => [user, ...prev]);
      setAddForm({ username: '', email: '', password: '' });
      setShowAddAdmin(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    try {
      const data: any = {};
      if (editForm.username) data.username = editForm.username;
      if (editForm.email) data.email = editForm.email;
      if (editForm.password) data.password = editForm.password;
      const updated = await api.admin.updateCredentials(editingUser.id, data);
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...updated } : u));
      setEditingUser(null);
      setEditForm({ username: '', email: '', password: '' });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">
              {tab === 'devices' ? 'Device intelligence &amp; tracking' : 'User management'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSuper && (
              <button
                onClick={() => setTab('users')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  tab === 'users' ? 'bg-primary text-white' : 'bg-surface-card text-gray-400 border border-surface-border'
                }`}
              >
                Users
              </button>
            )}
            <button
              onClick={() => setTab('devices')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === 'devices' ? 'bg-primary text-white' : 'bg-surface-card text-gray-400 border border-surface-border'
              }`}
            >
              Devices
            </button>
          </div>
        </div>

        {error && (
          <div className="card p-4 mb-6 border-red-500/20 bg-red-500/5">
            <p className="text-red-400 text-sm">Error: {error}</p>
          </div>
        )}

        {/* User Management Tab */}
        {tab === 'users' && isSuper && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">{users.length} admin(s)</p>
              <button
                onClick={() => setShowAddAdmin(p => !p)}
                className="btn-primary text-xs py-1.5 px-3"
              >
                + Add Admin
              </button>
            </div>

            {showAddAdmin && (
              <form onSubmit={handleAddAdmin} className="card p-4 mb-4">
                <p className="text-xs font-medium text-gray-400 mb-3">Create New Admin</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Username</label>
                    <input
                      type="text"
                      value={addForm.username}
                      onChange={e => setAddForm(p => ({ ...p, username: e.target.value }))}
                      className="input-field text-xs py-1.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={addForm.email}
                      onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))}
                      className="input-field text-xs py-1.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Password</label>
                    <input
                      type="password"
                      value={addForm.password}
                      onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))}
                      className="input-field text-xs py-1.5"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={adding} className="btn-primary text-xs py-1.5 px-4">
                    {adding ? 'Creating...' : 'Create Admin'}
                  </button>
                  <button type="button" onClick={() => setShowAddAdmin(false)} className="btn-secondary text-xs py-1.5 px-4">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {fetching ? (
              <div className="card p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Loading users...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white">{u.username}</p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                u.role === 'superadmin' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                u.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' :
                                'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                              }`}>
                                {u.role}
                              </span>
                              {u.banned && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                                  BANNED
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                            <p className="text-[10px] text-gray-600 mt-0.5">{u._count.apps} apps &middot; Joined {formatDate(u.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {u.role !== 'superadmin' && (
                            <>
                              <select
                                value={u.role}
                                onChange={e => handleRoleChange(u.id, e.target.value)}
                                className="text-xs bg-surface-card border border-surface-border rounded px-2 py-1 text-gray-300 cursor-pointer"
                              >
                                <option value="admin">admin</option>
                              </select>
                              <button
                                onClick={() => handleToggleBan(u.id)}
                                className={`text-xs px-2 py-1 rounded border transition-all ${
                                  u.banned
                                    ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                                    : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                }`}
                              >
                                {u.banned ? 'Unban' : 'Ban'}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(u);
                                  setEditForm({ username: u.username, email: u.email, password: '' });
                                }}
                                className="text-xs px-2 py-1 rounded border border-primary/30 text-primary hover:bg-primary/10 transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete user "${u.username}"? This will also remove their apps.`)) {
                                    api.admin.deleteUser(u.id).then(() => {
                                      setUsers(prev => prev.filter(x => x.id !== u.id));
                                    }).catch((err: any) => alert(err.message));
                                  }
                                }}
                                className="text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Edit Form Inline */}
                    {editingUser?.id === u.id && (
                      <div className="border-t border-surface-border bg-surface-light/50 p-4">
                        <p className="text-xs font-medium text-gray-400 mb-3">Edit Credentials</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Username</label>
                            <input
                              type="text"
                              value={editForm.username}
                              onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))}
                              className="input-field text-xs py-1.5"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Email</label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                              className="input-field text-xs py-1.5"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">New Password</label>
                            <input
                              type="password"
                              value={editForm.password}
                              onChange={e => setEditForm(p => ({ ...p, password: e.target.value }))}
                              placeholder="Leave blank to keep"
                              className="input-field text-xs py-1.5"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleEditSave} className="btn-primary text-xs py-1.5 px-4">
                            Save
                          </button>
                          <button onClick={() => setEditingUser(null)} className="btn-secondary text-xs py-1.5 px-4">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Device Intelligence Tab */}
        {tab === 'devices' && (
          fetching ? (
            <div className="card p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Loading device data...</p>
            </div>
          ) : devices.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">No device data recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {devices.map((device, i) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="card overflow-hidden"
                >
                    <div className="px-6 py-3 bg-surface-light/50 border-b border-surface-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {device.id}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{device.user.username}</p>
                          <p className="text-xs text-gray-500">{device.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{formatDate(device.createdAt)}</span>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this device log?')) {
                              api.device.delete(device.id).then(() => {
                                setDevices(prev => prev.filter(d => d.id !== device.id));
                              }).catch((err: any) => alert(err.message));
                            }
                          }}
                          className="text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Network</p>
                          <p className="text-gray-300">IP: {device.ip || '--'}</p>
                          <p className="text-gray-500">Conn: {device.connectionType || '--'}</p>
                          <p className="text-gray-500">Lang: {device.language || '--'}</p>
                          {device.latitude && device.longitude ? (
                            <p className="text-gray-500">
                              <a
                                href={`https://www.google.com/maps?q=${device.latitude},${device.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                View Location
                              </a>
                            </p>
                          ) : null}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Device</p>
                        <p className="text-gray-300">{device.platform || '--'}</p>
                        <p className="text-gray-500">{device.screenWidth}x{device.screenHeight}</p>
                        <p className="text-gray-500">Touch: {device.touchSupported ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">System</p>
                        <p className="text-gray-300">RAM: {device.deviceMemory ? `${device.deviceMemory}GB` : '--'}</p>
                        <p className="text-gray-500">CPU: {device.hardwareConcurrency ? `${device.hardwareConcurrency} cores` : '--'}</p>
                        <p className="text-gray-500">TZ: {device.timezone || '--'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Battery</p>
                        <p className="text-gray-300">{device.batteryLevel !== null ? `${(device.batteryLevel * 100).toFixed(0)}%` : '--'}</p>
                        <p className="text-gray-500">{device.batteryCharging !== null ? (device.batteryCharging ? 'Charging' : 'Not charging') : '--'}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-surface-border">
                      <p className="text-xs text-gray-600 break-all">{device.userAgent}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </motion.div>
    </div>
  );
}
