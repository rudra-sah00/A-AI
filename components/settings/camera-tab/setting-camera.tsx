"use client"

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CameraList from './camera-list';

// Form schema for camera settings
const cameraFormSchema = z.object({
  defaultResolution: z.string(),
  motionDetection: z.boolean(),
  audioRecording: z.boolean(),
  nightVision: z.boolean(),
  ptzControls: z.boolean(),
  motionSensitivity: z.number().min(1).max(10),
  recordingMode: z.string(),
  cameraDiscovery: z.boolean(),
});

export type CameraFormValues = z.infer<typeof cameraFormSchema>;

interface CameraSettingsProps {
  onSubmit: (data: CameraFormValues, name: string) => void;
  isSubmitting: boolean;
}

export default function CameraSettings({ onSubmit, isSubmitting }: CameraSettingsProps) {
  // Camera settings form
  const form = useForm<CameraFormValues>({
    resolver: zodResolver(cameraFormSchema),
    defaultValues: {
      defaultResolution: 'hd',
      motionDetection: true,
      audioRecording: false,
      nightVision: true,
      ptzControls: false,
      motionSensitivity: 5,
      recordingMode: 'motion',
      cameraDiscovery: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Camera List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Camera Management</CardTitle>
          <CardDescription>
            Add and configure your security cameras
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <CameraList />
        </CardContent>
      </Card>
    </div>
  );
}