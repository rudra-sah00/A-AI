"use client"

import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera,
  CameraFilter,
  addCamera,
  addCameraWithFilters,
  generateFilterId,
  AVAILABLE_FILTERS
} from '@/lib/services/cameraService';

// Form schema for adding a camera
const addCameraSchema = z.object({
  name: z.string().min(1, { message: 'Camera name is required' }),
  rtsp_url: z.string().min(1, { message: 'RTSP URL is required' })
    .regex(/^rtsp:\/\//, { message: 'URL must start with rtsp://' }),
});

export type AddCameraFormValues = z.infer<typeof addCameraSchema>;

interface AddCameraDialogProps {
  onCameraAdded: (camera: Camera) => void;
}

export default function AddCameraDialog({ onCameraAdded }: AddCameraDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<CameraFilter[]>([]);
  const { toast } = useToast();

  // Add camera form
  const form = useForm<AddCameraFormValues>({
    resolver: zodResolver(addCameraSchema),
    defaultValues: {
      name: '',
      rtsp_url: '',
    },
  });

  // Handle adding a new camera
  const handleAddCamera = async (data: AddCameraFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      let newCamera: Camera;
      
      // If filters are selected, use the addCameraWithFilters API
      if (selectedFilters.length > 0) {
        newCamera = await addCameraWithFilters({
          name: data.name,
          rtsp_url: data.rtsp_url,
          filters: selectedFilters,
          validate: true
        });
      } else {
        // Otherwise use the simple addCamera API
        newCamera = await addCamera({
          name: data.name,
          rtsp_url: data.rtsp_url
        });
      }
      
      // Notify parent component
      onCameraAdded(newCamera);
      
      toast({
        title: 'Camera Added',
        description: `${data.name} has been added successfully.`,
      });
      
      // Close dialog and reset form
      setIsOpen(false);
      form.reset();
      setSelectedFilters([]);
    } catch (error) {
      console.error('Error adding camera:', error);
      
      setError('Failed to add camera. Please check the connection details and try again.');
      
      toast({
        title: 'Error',
        description: 'Failed to add camera. Please check the details and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset the form when closing
      form.reset();
      setSelectedFilters([]);
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Camera
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Camera</DialogTitle>
          <DialogDescription>
            Enter the camera name and RTSP URL to add a new camera.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddCamera)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Camera Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Front Door Camera" {...field} />
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
                    <Input placeholder="rtsp://username:password@192.168.1.100:554/stream" {...field} />
                  </FormControl>
                  <FormDescription>
                    Format: rtsp://username:password@host:port/path or rtsp://host:port/path
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <h4 className="text-sm font-medium mb-2">AI Filters</h4>
              <div className="space-y-2 border rounded-md p-3">
                {AVAILABLE_FILTERS.map((filter) => (
                  <div key={filter.name} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{filter.name}</div>
                      <div className="text-xs text-muted-foreground">{filter.description}</div>
                    </div>
                    <Switch 
                      checked={selectedFilters.some(f => f.filter_name === filter.name && f.enabled)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFilters(prev => [
                            ...prev.filter(f => f.filter_name !== filter.name),
                            {
                              filter_id: generateFilterId(filter.name),
                              filter_name: filter.name,
                              enabled: true
                            }
                          ]);
                        } else {
                          setSelectedFilters(prev => 
                            prev.filter(f => f.filter_name !== filter.name)
                          );
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="text-sm font-medium text-destructive mt-2">
                {error}
              </div>
            )}
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : "Add Camera"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}