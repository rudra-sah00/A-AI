"use client"

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Clock } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Form schema for retention settings
const retentionFormSchema = z.object({
  footageRetention: z.string(),
  eventRetention: z.string(),
  autoDelete: z.boolean(),
  highQualityStorage: z.boolean(),
});

export type RetentionFormValues = z.infer<typeof retentionFormSchema>;

interface RetentionSettingsProps {
  onSubmit: (data: RetentionFormValues, name: string) => void;
  isSubmitting: boolean;
}

export default function RetentionSettings({ onSubmit, isSubmitting }: RetentionSettingsProps) {
  // Retention settings form
  const form = useForm<RetentionFormValues>({
    resolver: zodResolver(retentionFormSchema),
    defaultValues: {
      footageRetention: '30d',
      eventRetention: '90d',
      autoDelete: true,
      highQualityStorage: false,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Retention Settings</CardTitle>
        <CardDescription>
          Configure how long footage and event data is stored
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data, 'retention'))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="footageRetention"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camera Footage Retention</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select retention period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="7d">7 days</SelectItem>
                        <SelectItem value="14d">14 days</SelectItem>
                        <SelectItem value="30d">30 days</SelectItem>
                        <SelectItem value="60d">60 days</SelectItem>
                        <SelectItem value="90d">90 days</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How long to keep camera recordings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventRetention"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Log Retention</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select retention period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30d">30 days</SelectItem>
                        <SelectItem value="60d">60 days</SelectItem>
                        <SelectItem value="90d">90 days</SelectItem>
                        <SelectItem value="180d">180 days</SelectItem>
                        <SelectItem value="365d">1 year</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How long to keep event records
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="autoDelete"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Auto-Delete Old Footage</FormLabel>
                      <FormDescription>
                        Automatically delete footage beyond retention period
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="highQualityStorage"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">High-Quality Storage</FormLabel>
                      <FormDescription>
                        Store all footage in high quality (requires more storage)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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