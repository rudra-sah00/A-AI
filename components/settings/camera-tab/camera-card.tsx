"use client"

import { useState } from 'react';
import { Filter, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraFilter } from '@/lib/services/cameraService';

interface CameraCardProps {
  camera: Camera;
  onEditClick: (camera: Camera) => void;
  onFiltersClick: (camera: Camera) => void;
  onDeleteClick: (cameraId: string) => void;
}

export default function CameraCard({
  camera,
  onEditClick,
  onFiltersClick,
  onDeleteClick
}: CameraCardProps) {
  const { toast } = useToast();
  
  return (
    <div className="p-3 border rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{camera.name}</h3>
            <Badge variant={camera.status === 'online' ? 'default' : 'secondary'}>
              {camera.status || 'offline'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">{camera.rtsp_url}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onFiltersClick(camera)}
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Manage Filters</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEditClick(camera)}
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDeleteClick(camera.id || '')}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
      
      {/* Display active filters */}
      {camera.filters && camera.filters.length > 0 && (
        <div className="mt-2">
          <div className="flex flex-wrap gap-2 mt-1">
            {camera.filters.filter(f => f.enabled).map(filter => (
              <Badge key={filter.filter_id} variant="secondary" className="text-xs">
                <Filter className="h-3 w-3 mr-1" />
                {filter.filter_name}
              </Badge>
            ))}
            {camera.filters.filter(f => f.enabled).length === 0 && (
              <span className="text-xs text-muted-foreground">No active filters</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}