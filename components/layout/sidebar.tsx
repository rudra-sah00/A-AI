"use client"

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  LayoutDashboard,
  Camera,
  AlertTriangle,
  Activity,
  Settings,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Shield,
  BrainCircuit,
  FlaskConical, // Added for Test icon
  Bell, // Added for Notifications icon
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: SidebarItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    cameras: true,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups({
      ...openGroups,
      [group]: !openGroups[group],
    });
  };

  const sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: 'Notifications', // New Notifications menu item
      href: '/dashboard/notifications',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      title: 'Cameras',
      href: '/dashboard/cameras',
      icon: <Camera className="w-5 h-5" />,
      submenu: [
        {
          title: 'Live View',
          href: '/dashboard/cameras/live',
          icon: <PlayCircle className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Health',
      href: '/dashboard/health',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      title: 'AI Assistant',
      href: '/dashboard/ai-assistant',
      icon: <BrainCircuit className="w-5 h-5" />,
    },
    {
      title: 'Test', // New Test menu
      href: '/dashboard/test',
      icon: <FlaskConical className="w-5 h-5" />,
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  // Admin-only items - Users option removed
  const adminItems: SidebarItem[] = [];

  // Animation variants
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const renderSidebarItems = (items: SidebarItem[], startDelay: number = 0) => {
    return items.map((item, index) => {
      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
      
      if (item.submenu) {
        return (
          <motion.div
            key={item.href}
            className="space-y-1"
            variants={itemVariants}
            transition={{ delay: startDelay + (index * 0.05) }}
          >
            <Collapsible 
              open={openGroups[item.title.toLowerCase()] || isActive}
              onOpenChange={() => toggleGroup(item.title.toLowerCase())}
            >
              <CollapsibleTrigger className="w-full">
                <div
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    "justify-between w-full hover:bg-muted/80 transition-colors",
                    isActive && "bg-muted font-medium"
                  )}
                >
                  <div className="flex items-center">
                    <motion.div 
                      whileHover={{ rotate: isActive ? 0 : 10 }}
                      className="text-primary"
                    >
                      {item.icon}
                    </motion.div>
                    <span className="ml-2">{item.title}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: openGroups[item.title.toLowerCase()] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-8 space-y-1 pt-1">
                {item.submenu.map((subitem, subIndex) => {
                  const isSubActive = pathname === subitem.href;
                  return (
                    <motion.div
                      key={subitem.href}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (subIndex * 0.05) }}
                    >
                      <Link
                        href={subitem.href}
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'sm' }),
                          "justify-start w-full transition-all",
                          isSubActive ? "bg-muted font-medium" : "hover:bg-muted/50"
                        )}
                      >
                        <motion.div whileHover={{ scale: 1.1 }} className="text-primary">
                          {subitem.icon}
                        </motion.div>
                        <span className="ml-2">{subitem.title}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        );
      }
      
      return (
        <motion.div
          key={item.href}
          variants={itemVariants}
          transition={{ delay: startDelay + (index * 0.05) }}
        >
          <Link
            href={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              "justify-start w-full transition-colors",
              isActive ? "bg-muted font-medium" : "hover:bg-muted/50"
            )}
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="text-primary"
            >
              {item.icon}
            </motion.div>
            <span className="ml-2">{item.title}</span>
          </Link>
        </motion.div>
      );
    });
  };

  return (
    <div className="hidden md:flex fixed top-16 h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background">
      <div className="flex flex-col h-full p-4 pt-6 overflow-hidden">
        {/* Non-scrollable sidebar content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
          className="flex flex-col gap-2"
        >
          {renderSidebarItems(sidebarItems, 0.3)}
          
          {user?.role === 'admin' && adminItems.length > 0 && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="h-px bg-border my-4" 
              />
              {renderSidebarItems(adminItems, 0.9)}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}