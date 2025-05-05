"use client"

import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Camera,
  CameraFilter,
  updateCameraFilters,
  AVAILABLE_FILTERS
} from '@/lib/services/cameraService';
import { useToast } from '@/hooks/use-toast';

interface CameraFiltersDialogProps {
  camera: Camera | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersUpdated: (camera: Camera, filters: CameraFilter[]) => void;
}

export default function CameraFiltersDialog({
  camera,
  isOpen,
  onOpenChange,
  onFiltersUpdated
}: CameraFiltersDialogProps) {
  const { toast } = useToast();

  // Function to toggle filter for a specific camera
  const toggleFilter = async (filterName: string, enabled: boolean) => {
    if (!camera || !camera.id) return;
    
    try {
      let filters = camera.filters || [];
      let existingFilter = filters.find(f => f.filter_name === filterName);
      
      if (existingFilter) {
        // Update existing filter
        filters = filters.map(f => 
          f.filter_name === filterName ? { ...f, enabled } : f
        );
      } else {
        // Add new filter with a generated ID
        const timestamp = new Date().getTime().toString(36);
        const filterBase = filterName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const filterId = `${filterBase}-${timestamp.slice(-4)}`;

        filters = [
          ...filters, 
          { 
            filter_id: filterId,
            filter_name: filterName,
            enabled
          }
        ];
      }
      
      // Update filters on the server
      await updateCameraFilters(camera.id, filters);
      
      // Notify parent component that filters were updated
      onFiltersUpdated(camera, filters);
      
      toast({
        title: `Filter ${enabled ? 'Enabled' : 'Disabled'}`,
        description: `${filterName} filter has been ${enabled ? 'enabled' : 'disabled'} for ${camera.name}`,
      });
    } catch (error) {
      console.error('Error updating camera filter:', error);
      toast({
        title: 'Error',
        description: 'Failed to update camera filter.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Camera Filters</DialogTitle>
          <DialogDescription>
            Enable or disable AI filters for {camera?.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            {AVAILABLE_FILTERS.map((filter) => {
              const cameraFilter = camera?.filters?.find(f => f.filter_name === filter.name);
              const isEnabled = cameraFilter?.enabled || false;
              
              return (
                <div key={filter.name} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm font-medium">{filter.name}</div>
                    </div>
                    <div className="text-xs text-muted-foreground ml-6">{filter.description}</div>
                  </div>
                  <Switch 
                    checked={isEnabled}
                    onCheckedChange={(checked) => toggleFilter(filter.name, checked)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}