"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Camera } from '@/lib/services/cameraService';

// Form schema for editing a camera
const editCameraSchema = z.object({
  name: z.string().min(1, { message: 'Camera name is required' }),
  rtsp_url: z.string().min(1, { message: 'RTSP URL is required' })
    .regex(/^rtsp:\/\//, { message: 'URL must start with rtsp://' }),
});

export type EditCameraFormValues = z.infer<typeof editCameraSchema>;

interface EditCameraDialogProps {
  camera: Camera | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (cameraId: string, data: EditCameraFormValues) => void;
}

export default function EditCameraDialog({
  camera,
  isOpen,
  onOpenChange,
  onUpdate
}: EditCameraDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<EditCameraFormValues>({
    resolver: zodResolver(editCameraSchema),
    defaultValues: {
      name: camera?.name || '',
      rtsp_url: camera?.rtsp_url || '',
    },
  });

  // Update form values when the camera changes
  useState(() => {
    if (camera) {
      form.reset({
        name: camera.name,
        rtsp_url: camera.rtsp_url,
      });
    }
  });

  const handleSubmit = (data: EditCameraFormValues) => {
    if (!camera || !camera.id) return;
    
    onUpdate(camera.id, data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Camera</DialogTitle>
          <DialogDescription>
            Update the connection details for your camera.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Camera Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rtsp_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RTSP URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Format: rtsp://username:password@host:port/path or rtsp://host:port/path
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Camera</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}