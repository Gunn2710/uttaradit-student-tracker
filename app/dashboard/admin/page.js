"use client"
import React, { useEffect, useState } from 'react'
import { useUserRole } from '@/hooks/useUserRole'
import { ROLES } from '@/lib/roles'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Shield, ShieldCheck, Eye, Loader2 } from 'lucide-react'
import Image from 'next/image'

function AdminPage() {
    const { isAdmin, isLoaded, role } = useUserRole();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        if (isLoaded && isAdmin) {
            fetchUsers();
        }
    }, [isLoaded, isAdmin]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to fetch users');
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (targetUserId, newRole) => {
        setUpdating(targetUserId);
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId, role: newRole }),
            });

            if (response.ok) {
                toast.success('User role updated successfully');
                // Update local state
                setUsers(users.map(user => 
                    user.id === targetUserId ? { ...user, role: newRole } : user
                ));
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to update role');
            }
        } catch (error) {
            toast.error('Failed to update role');
        } finally {
            setUpdating(null);
        }
    };

    const getRoleIcon = (userRole) => {
        switch (userRole) {
            case ROLES.ADMIN:
                return <Shield className="h-4 w-4 text-red-500" />;
            case ROLES.EDITOR:
                return <ShieldCheck className="h-4 w-4 text-green-500" />;
            default:
                return <Eye className="h-4 w-4 text-gray-500" />;
        }
    };

    const getRoleBadgeColor = (userRole) => {
        switch (userRole) {
            case ROLES.ADMIN:
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case ROLES.EDITOR:
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    if (!isLoaded) {
        return (
            <div className="p-10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="p-10">
                <div className="border rounded-lg p-10 text-center">
                    <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-muted-foreground">
                        You don't have permission to access this page.
                        <br />
                        Only administrators can manage users.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">การจัดการผู้ใช้/User Management</h2>
                    <p className="text-muted-foreground">Approve users and manage their permissions</p>
                </div>
                <Button onClick={fetchUsers} variant="outline">
                    Refresh
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-10">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-4 py-3 text-left">User</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Current Role</th>
                                <th className="px-4 py-3 text-left">Joined</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {user.imageUrl && (
                                                <Image
                                                    src={user.imageUrl}
                                                    alt={user.firstName || 'User'}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />
                                            )}
                                            <span>{user.firstName} {user.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                            {getRoleIcon(user.role)}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {user.role !== ROLES.EDITOR && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateUserRole(user.id, ROLES.EDITOR)}
                                                    disabled={updating === user.id}
                                                >
                                                    {updating === user.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        'Approve as Editor'
                                                    )}
                                                </Button>
                                            )}
                                            {user.role === ROLES.EDITOR && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => updateUserRole(user.id, ROLES.VIEWER)}
                                                    disabled={updating === user.id}
                                                >
                                                    {updating === user.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        'Revoke Access'
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="p-10 text-center text-muted-foreground">
                            No users found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminPage

