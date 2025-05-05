import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent as BaseDialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, deleteUser } from '@/lib/services/userService';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

// Custom DialogContent without the X close button
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="bg-black/60" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted: (username: string) => void;
}

export function UserDetailsDialog({ 
  user, 
  open, 
  onOpenChange,
  onUserDeleted
}: UserDetailsDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Function to handle user deletion
  const handleDeleteUser = async () => {
    if (!user?.username) return;
    
    setIsDeleting(true);
    try {
      await deleteUser(user.username);
      
      toast({
        title: 'User Deleted',
        description: `${user.username} has been removed successfully.`,
      });
      
      onUserDeleted(user.username);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-gradient-to-b from-background to-background/95 border-2 border-primary/10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with gradient overlay */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl text-center">User Profile</DialogTitle>
            </DialogHeader>
          </div>
          
          {/* User profile content with staggered animations */}
          <div className="flex flex-col items-center gap-4 p-6 pt-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/40 rounded-full blur opacity-30" />
              <Avatar className="h-28 w-28 border-4 border-background relative">
                <AvatarImage 
                  src={user.photo_url || user.photoData}
                  alt={user.username} 
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/60 to-primary/90 text-primary-foreground">
                  {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-1"
            >
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                @{user.username}
              </h3>
              <p className="text-lg">{user.full_name}</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-6 mt-2 w-full"
            >
              <div className="text-center p-3 rounded-lg bg-muted/50 flex-1 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-xl font-medium">{user.age}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50 flex-1 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-1 px-3 py-1">
                  {user.role}
                </Badge>
              </div>
            </motion.div>
          </div>

          {/* Footer with action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <DialogFooter className="flex flex-col items-center gap-3 bg-muted/30 p-6 border-t">
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="w-full max-w-[180px] flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete User"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="w-full max-w-[180px] shadow-sm transition-all hover:bg-primary/10 hover:border-primary/20"
              >
                Close
              </Button>
            </DialogFooter>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}