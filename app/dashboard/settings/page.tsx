"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Monitor, Camera, Clock, Database, Users, BookOpen } from 'lucide-react';

// Import our modular settings components
import GeneralSettings from '@/components/settings/general-settings';
import RetentionSettings from '@/components/settings/retention-settings';
import CameraSettings from '@/components/settings/camera-tab/setting-camera';
import AdvancedSettings from '@/components/settings/advanced-settings';
import UserSettings from '@/components/settings/user-tab/setting-users';
import RulesSettings from '@/components/settings/rules-tab/setting-rule';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Set the active tab based on URL parameter
  useEffect(() => {
    // Valid tab values
    const validTabs = ["general", "cameras", "users", "rules", "retention", "advanced"];
    
    // If the tab parameter exists and is valid, set it as the active tab
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Generic form submission handler
  const onSubmit = (formData: any, formName: string) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Settings saved',
        description: `Your ${formName} settings have been updated.`,
      });
    }, 1000);
    
    console.log(formData);
  };

  return (
    <div className="container mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your system preferences and configuration.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Fixed tabs header that stays in view */}
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 h-auto">
            <TabsTrigger value="general" className="flex gap-2 items-center">
              <Monitor className="h-4 w-4" />
              <span className="hidden md:block">General</span>
            </TabsTrigger>
            <TabsTrigger value="cameras" className="flex gap-2 items-center">
              <Camera className="h-4 w-4" />
              <span className="hidden md:block">Cameras</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex gap-2 items-center">
              <Users className="h-4 w-4" />
              <span className="hidden md:block">Users</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex gap-2 items-center">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:block">Rules</span>
            </TabsTrigger>
            <TabsTrigger value="retention" className="flex gap-2 items-center">
              <Clock className="h-4 w-4" />
              <span className="hidden md:block">Retention</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex gap-2 items-center">
              <Database className="h-4 w-4" />
              <span className="hidden md:block">Advanced</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Scrollable content area */}
        <div className="overflow-visible">
          {/* General Settings */}
          <TabsContent value="general">
            <GeneralSettings onSubmit={onSubmit} isSubmitting={isSubmitting} />
          </TabsContent>
          
          {/* Camera Settings */}
          <TabsContent value="cameras">
            <CameraSettings onSubmit={onSubmit} isSubmitting={isSubmitting} />
          </TabsContent>
          
          {/* User Settings */}
          <TabsContent value="users">
            <UserSettings onSubmit={onSubmit} isSubmitting={isSubmitting} />
          </TabsContent>

          {/* Rules Settings */}
          <TabsContent value="rules">
            <RulesSettings onSubmit={onSubmit} isSubmitting={isSubmitting} />
          </TabsContent>

          {/* Retention Settings */}
          <TabsContent value="retention">
            <RetentionSettings onSubmit={onSubmit} isSubmitting={isSubmitting} />
          </TabsContent>
          
          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <AdvancedSettings 
              onSave={() => {
                setIsSubmitting(true);
                setTimeout(() => {
                  setIsSubmitting(false);
                  toast({
                    title: 'Settings saved',
                    description: 'Your advanced settings have been updated.',
                  });
                }, 1000);
              }} 
              isSubmitting={isSubmitting} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}