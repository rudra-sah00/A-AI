import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, addUser, dataURLToBlob } from '@/lib/services/userService';
import { Camera, Check, X, Upload, ImageIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form schema for adding a new user
const newUserSchema = z.object({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  username: z.string().min(2, { message: "Username must be at least 2 characters" })
    .regex(/^[a-z0-9_]+$/, { message: "Username can only contain lowercase letters, numbers, and underscores" }),
  age: z.number().min(18, { message: "User must be at least 18 years old" }),
  role: z.string().min(2, { message: "Role must be at least 2 characters" }),
  customRole: z.string().optional(),
});

export type NewUserValues = z.infer<typeof newUserSchema>;

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: User) => void;
}

export function AddUserDialog({ 
  open, 
  onOpenChange,
  onUserAdded
}: AddUserDialogProps) {
  // Webcam capture states
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [photoMode, setPhotoMode] = useState<'none' | 'camera' | 'upload'>('none');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // New user form
  const newUserForm = useForm<NewUserValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      full_name: '',
      username: '',
      age: 25,
      role: 'worker',
      customRole: '',
    },
  });

  // Effect to auto-generate username from full_name
  useEffect(() => {
    const subscription = newUserForm.watch((value, { name }) => {
      if (name === 'full_name' && value.full_name) {
        // Generate username from full_name (lowercase, no spaces)
        const generatedUsername = value.full_name.toLowerCase().replace(/\s+/g, '');
        newUserForm.setValue('username', generatedUsername);
      }
      
      // Check if custom role is selected
      if (name === 'role') {
        setIsCustomRole(value.role === 'custom');
        if (value.role !== 'custom') {
          newUserForm.setValue('customRole', '');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [newUserForm]);

  // Start or stop camera when the dialog opens/closes
  useEffect(() => {
    if (open) {
      // Small delay to ensure the video element is mounted
      setTimeout(() => {
        startCamera();
      }, 300);
    } else {
      stopCamera();
      setCapturedImage(null);
    }
  }, [open]);

  // Make sure to reset state when dialog closes
  useEffect(() => {
    if (!open) {
      stopCamera();
      setCapturedImage(null);
      setPhotoMode('none');
    }
  }, [open]);

  // Start camera when camera mode is selected
  useEffect(() => {
    if (photoMode === 'camera') {
      // Small delay to ensure the video element is mounted
      setTimeout(() => {
        startCamera();
      }, 300);
    } else if (photoMode === 'upload') {
      stopCamera();
    }
  }, [photoMode]);

  // Function to start webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      toast({
        title: 'Camera Error',
        description: 'Could not access webcam. Please check your permissions.',
        variant: 'destructive',
      });
    }
  };

  // Function to stop webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Function to capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        
        // Stop the camera after capture
        stopCamera();
      }
    }
  };

  // Function to reset the photo capture
  const resetCapture = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Clean up webcam when the component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Image must be less than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setCapturedImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Function to reset the photo selection
  const resetPhotoSelection = () => {
    setCapturedImage(null);
    setPhotoMode('none');
  };

  // Function to add a new user
  const handleAddUser = async (data: NewUserValues) => {
    if (!capturedImage) {
      toast({
        title: 'Photo Required',
        description: 'Please capture a photo of the user.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Convert the data URL to a Blob for upload
      const photoBlob = dataURLToBlob(capturedImage);
      
      // Create the new user object with the updated field names
      const userData: User = {
        full_name: data.full_name,
        username: data.username,
        age: data.age,
        role: data.role === 'admin' || data.role === 'worker' 
          ? data.role 
          : 'worker', // Default to 'worker' if custom role is used
      };
      
      // Send the user data  to the API
      const newUser = await addUser(userData, photoBlob);
      
      // Success message
      toast({
        title: 'User Added',
        description: `${data.username} has been added successfully.`,
      });
      
      // Close the dialog and reset the form
      onOpenChange(false);
      newUserForm.reset();
      setCapturedImage(null);
      
      // Notify parent component
      onUserAdded(newUser);
      
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: 'Failed to add user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user with photo for AI facial recognition.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Photo capture section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="border rounded-md overflow-hidden relative w-full max-w-[320px] aspect-[4/3] bg-muted">
              {capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="Captured user" 
                  className="w-full h-full object-cover"
                />
              ) : photoMode === 'camera' ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : photoMode === 'upload' ? (
                <div className="flex items-center justify-center w-full h-full">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p className="text-muted-foreground text-sm">
                    Select a photo source below
                  </p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload} 
              />
            </div>
            
            <div className="flex gap-2">
              {!capturedImage ? (
                photoMode === 'none' ? (
                  <>
                    <Button 
                      type="button" 
                      onClick={() => setPhotoMode('camera')}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setPhotoMode('upload');
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </>
                ) : photoMode === 'camera' ? (
                  <>
                    <Button 
                      type="button" 
                      onClick={capturePhoto} 
                      disabled={!isCameraActive}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Capture Photo
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setPhotoMode('none')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Different Photo
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setPhotoMode('none')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetPhotoSelection}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Photo OK
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* User details form */}
          <Form {...newUserForm}>
            <form onSubmit={newUserForm.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={newUserForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., John Smith" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={newUserForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., johnsmith" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={newUserForm.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        min={18}
                        max={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={newUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setIsCustomRole(value === "custom");
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="worker">Worker</SelectItem>
                        <SelectItem value="custom">Custom Role</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isCustomRole && (
                <FormField
                  control={newUserForm.control}
                  name="customRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Role Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., Manager, Supervisor, etc." 
                          onChange={(e) => {
                            field.onChange(e);
                            // Set the actual role value to the custom role name
                            if (e.target.value) {
                              newUserForm.setValue('role', e.target.value);
                            } else {
                              newUserForm.setValue('role', 'custom');
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={!capturedImage}
                >
                  Add User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}