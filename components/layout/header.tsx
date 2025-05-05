"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { Shield, Bell, X, Menu, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { useGeneralSettings } from '@/hooks/use-general-settings';
import { motion } from 'framer-motion';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { notifications, clearNotification, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const { systemName } = useGeneralSettings();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="md:hidden mr-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 sm:max-w-xs w-[300px]">
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {systemName}
                </SheetTitle>
              </SheetHeader>
              {/* Mobile navigation links rendered by the sidebar component */}
            </SheetContent>
          </Sheet>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-2 mr-6"
        >
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight hidden md:block">{systemName}</span>
        </motion.div>
        
        <div className="flex-1 flex items-center justify-end ml-auto gap-4 md:gap-6 lg:gap-8">
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                        >
                          {unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-[380px] p-0" align="end">
                <div className="flex items-center justify-between p-3 border-b">
                  <h4 className="font-medium">Notifications</h4>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead} 
                      disabled={!notifications.length}
                    >
                      Mark all read
                    </Button>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification, index) => (
                        <motion.div 
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                          className={`flex items-start gap-3 p-3 hover:bg-muted/50 border-b last:border-0 transition ${!notification.read ? 'bg-muted/30' : ''}`}
                        >
                          <div className={`h-2 w-2 mt-2 rounded-full flex-shrink-0 ${notification.type === 'alert' ? 'bg-destructive' : notification.type === 'warning' ? 'bg-amber-500' : 'bg-primary'}`} />
                          <div className="flex-1 flex flex-col gap-1">
                            <span className="text-sm font-medium">{notification.title}</span>
                            <span className="text-xs text-muted-foreground">{notification.message}</span>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={() => clearNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            <ModeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="secondary" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{user?.username}
                    </p>
                    <Badge variant="outline" className="w-fit mt-1">
                      {user?.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  );
}