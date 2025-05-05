"use client"

import { useState, useEffect } from 'react';
import { Camera as CameraIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import CameraCard from './camera-card';
import AddCameraDialog from './add-camera-dialog';
import EditCameraDialog from './edit-camera-dialog';
import CameraFiltersDialog from './camera-filters-dialog';
import { 
  Camera, 
  CameraFilter,
  fetchCameras,
  fetchCameraFilters,
  deleteCameraById
} from '@/lib/services/cameraService';
import { EditCameraFormValues } from './edit-camera-dialog';

export default function CameraList() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load cameras on component mount
  useEffect(() => {
    loadCameras();
  }, []);
  
  // Function to load cameras from API
  const loadCameras = async () => {
    setIsLoading(true);
    try {
      const camerasData = await fetchCameras();
      setCameras(camerasData);
    } catch (error) {
      console.error('Failed to load cameras:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cameras. Please try again.',
        variant: 'destructive',
      });
      setCameras([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle adding a new camera
  const handleCameraAdded = (newCamera: Camera) => {
    setCameras(current => [...current, newCamera]);
  };

  // Function to handle camera deletion
  const handleDeleteCamera = async (cameraId: string) => {
    try {
      await deleteCameraById(cameraId);
      setCameras(cameras.filter(camera => camera.id !== cameraId));
      toast({
        title: 'Camera Removed',
        description: 'Camera has been removed successfully',
      });
    } catch (error) {
      console.error('Error deleting camera:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete camera. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Function to handle editing a camera
  const handleEditCamera = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsEditDialogOpen(true);
  };

  // Function to handle updating camera details
  const handleUpdateCamera = (cameraId: string, data: EditCameraFormValues) => {
    // In a real implementation, this would make an API call to update the camera
    toast({
      title: 'Not Implemented',
      description: 'Camera editing is not implemented in this demo.',
    });
    
    setIsEditDialogOpen(false);
    setSelectedCamera(null);
  };

  // Function to open filters management dialog
  const handleOpenFilters = async (camera: Camera) => {
    setSelectedCamera(camera);
    
    // If camera already has filters loaded, use them
    if (camera.filters) {
      setIsFiltersDialogOpen(true);
      return;
    }
    
    // Otherwise fetch filters from API
    try {
      if (camera.id) {
        const filters = await fetchCameraFilters(camera.id);
        
        // Update the camera in the local state with the fetched filters
        setCameras(current => 
          current.map(c => 
            c.id === camera.id 
              ? { ...c, filters } 
              : c
          )
        );
        
        // Update the selected camera with filters
        setSelectedCamera({ ...camera, filters });
      }
      
      setIsFiltersDialogOpen(true);
    } catch (error) {
      console.error('Error fetching camera filters:', error);
      toast({
        title: 'Error',
        description: 'Failed to load camera filters.',
        variant: 'destructive',
      });
    }
  };

  // Function to handle filter updates
  const handleFiltersUpdated = (camera: Camera, filters: CameraFilter[]) => {
    // Update the camera in the cameras array with the new filters
    setCameras(current => 
      current.map(c => 
        c.id === camera.id 
          ? { ...c, filters } 
          : c
      )
    );
    
    // Update selected camera with new filters
    if (selectedCamera && selectedCamera.id === camera.id) {
      setSelectedCamera({ ...camera, filters });
    }
  };

  return (
    <div className="space-y-3">
      {/* Header with Add Camera button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Cameras</h3>
        <AddCameraDialog onCameraAdded={handleCameraAdded} />
      </div>

      {/* Camera List */}
      <ScrollArea className="h-[300px] pr-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="loading">Loading cameras...</div>
          </div>
        ) : cameras.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <CameraIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="font-medium">No cameras added</h3>
            <p className="text-sm text-muted-foreground">
              Click the "Add Camera" button to add your first camera
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cameras.map((camera) => (
              <CameraCard
                key={camera.id}
                camera={camera}
                onEditClick={handleEditCamera}
                onFiltersClick={handleOpenFilters}
                onDeleteClick={handleDeleteCamera}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Edit Camera Dialog */}
      <EditCameraDialog
        camera={selectedCamera}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleUpdateCamera}
      />

      {/* Manage Filters Dialog */}
      <CameraFiltersDialog
        camera={selectedCamera}
        isOpen={isFiltersDialogOpen}
        onOpenChange={setIsFiltersDialogOpen}
        onFiltersUpdated={handleFiltersUpdated}
      />
    </div>
  );
}