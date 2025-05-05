"use client"

import { Loader2, Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, fetchUsers, fetchUserByUsername, deleteUser } from '@/lib/services/userService';
import { AddUserDialog } from './add-user-dialog';
import { UserDetailsDialog } from './user-details-dialog';
import { UserCard } from './user-card';

// Props interface for the component
interface UserListProps {
  onSubmit?: (data: any) => void;
  isSubmitting?: boolean;
}

export function UserList({ onSubmit, isSubmitting }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch users from API on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Function to load users from the backend API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to view user details
  const viewUserDetails = async (username: string) => {
    try {
      const user = await fetchUserByUsername(username);
      setSelectedUser(user);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user details. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle adding a new user
  const handleUserAdded = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    // Reload users to get fresh data
    setTimeout(() => {
      loadUsers();
    }, 500);
  };

  // Handle user deletion
  const handleUserDeleted = (username: string) => {
    setUsers(prev => prev.filter(user => user.username !== username));
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>User List</CardTitle>
            <CardDescription>
              Manage users for AI facial recognition
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground whitespace-nowrap">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading users...</span>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Photo</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <UserCard 
                          key={user.username}
                          user={user}
                          onClick={() => viewUserDetails(user.username)}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User modals */}
      <AddUserDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onUserAdded={handleUserAdded}
      />
      
      <UserDetailsDialog
        user={selectedUser}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  );
}