"use client"

import * as z from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Form schema for general settings
const generalFormSchema = z.object({
  systemName: z.string().min(2, { message: 'System name must be at least 2 characters.' }),
  timezone: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string(),
});

export type GeneralFormValues = z.infer<typeof generalFormSchema>;

interface GeneralSettingsProps {
  onSubmit: (data: GeneralFormValues, name: string) => void;
  isSubmitting: boolean;
}

// Function to load settings from localStorage
const loadSettings = (): GeneralFormValues => {
  if (typeof window !== 'undefined') {
    const savedSettings = localStorage.getItem('generalSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  }
  
  // Default values if no saved settings
  return {
    systemName: 'SecureView AI',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  };
};

// Function to save settings to localStorage
const saveSettings = (data: GeneralFormValues) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('generalSettings', JSON.stringify(data));
  }
};

export default function GeneralSettings({ onSubmit, isSubmitting }: GeneralSettingsProps) {
  // General settings form
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      systemName: 'SecureView AI',
      timezone: 'UTC-5',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
    },
  });

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = loadSettings();
    form.reset(savedSettings);
  }, [form]);

  // Custom submit handler to save to localStorage and call the parent onSubmit
  const handleSubmit = (data: GeneralFormValues) => {
    saveSettings(data);
    onSubmit(data, 'general');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure basic system settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="systemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of your security system
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                        <SelectItem value="UTC-7">UTC-7 (Mountain Time)</SelectItem>
                        <SelectItem value="UTC-6">UTC-6 (Central Time)</SelectItem>
                        <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                        <SelectItem value="UTC">UTC (Universal Time)</SelectItem>
                        <SelectItem value="UTC+1">UTC+1 (Central European Time)</SelectItem>
                        <SelectItem value="UTC+8">UTC+8 (China Standard Time)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the timezone for timestamps
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How dates are displayed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How times are displayed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}