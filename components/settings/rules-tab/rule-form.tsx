"use client"

import { useState, useEffect } from 'react';
import * as z from 'zod';
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
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  RuleEvent,
  VehicleRole,
  RuleCondition,
} from '@/lib/services/rulesService';
import { fetchCameras } from '@/lib/services/cameraService';
import { Camera } from '@/lib/services/cameraService';
import { toast } from 'sonner';

// Define the conditional base schema parts
const baseSchema = {
  name: z.string().min(2, { message: "Rule name must be at least 2 characters." }),
  enabled: z.boolean(),
  cameraId: z.string().min(1, { message: "Camera selection is required" }),
  days: z.array(z.string()).min(1, { message: "At least one day must be selected" }),
};

// Create special schema for authorized entry without days requirement
const authorizedEntrySchema = {
  name: z.string().min(2, { message: "Rule name must be at least 2 characters." }),
  enabled: z.boolean(),
  cameraId: z.string().min(1, { message: "Camera selection is required" }),
  role: z.string().min(1, { message: "Role is required" }),
};

// Create special schema for vehicle recognized without days requirement
const vehicleRecognizedSchema = {
  name: z.string().min(2, { message: "Rule name must be at least 2 characters." }),
  enabled: z.boolean(),
  cameraId: z.string().min(1, { message: "Camera selection is required" }),
  role: z.string().min(1, { message: "Role is required" }),
};

// Create full schema with conditional fields
const ruleFormSchema = z.discriminatedUnion('event', [
  // Attendance event schema
  z.object({
    ...baseSchema,
    event: z.literal('attendance'),
    role: z.string().min(1, { message: "Role is required" }),
    entryTimeStart: z.string().min(1, { message: "Entry start time is required" }),
    entryTimeEnd: z.string().min(1, { message: "Entry end time is required" }),
    exitTime: z.string().min(1, { message: "Exit time is required" }),
    intervalCheck: z.boolean().optional(),
  }),
  // Authorized entry schema
  z.object({
    ...authorizedEntrySchema,
    event: z.literal('authorized_entry'),
  }),
  // Vehicle recognized event schema
  z.object({
    ...vehicleRecognizedSchema,
    event: z.literal('vehicle_recognized'),
  }),
]);

export type RuleFormValues = z.infer<typeof ruleFormSchema>;

interface RuleFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  initialValues?: any;
}

export default function RuleForm({ onSubmit, isSubmitting, onCancel, initialValues }: RuleFormProps) {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isLoadingCameras, setIsLoadingCameras] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  // Days of the week for selection
  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  // Form instance
  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: initialValues || {
      name: '',
      event: 'authorized_entry' as RuleEvent,
      enabled: true,
      cameraId: '',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
  });

  // Current event type
  const eventType = form.watch('event');

  // Event options focused on the requested types
  const getEventOptions = () => [
    { value: 'authorized_entry', label: 'Authorized Entry' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'vehicle_recognized', label: 'Vehicle Recognized' }
  ];

  // Fetch user roles from API
  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/roles');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      // Assuming the API returns an array of role strings
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      toast.error('Failed to load user roles');
      // Fallback to some default roles
      setRoles(['Employee', 'Manager', 'Visitor', 'Contractor', 'Security']);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // Load cameras and roles on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoadingCameras(true);
        const camerasData = await fetchCameras();
        setCameras(camerasData);
        
        // Fetch roles from the backend
        fetchRoles();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoadingCameras(false);
      }
    }

    loadData();
  }, []);

  // Create the appropriate condition object based on the event type
  const createConditionObject = (data: RuleFormValues): RuleCondition => {
    if (data.event === 'attendance') {
      return {
        type: 'attendance',
        data: {
          role: (data as any).role || '',
          entryTimeStart: (data as any).entryTimeStart || '',
          entryTimeEnd: (data as any).entryTimeEnd || '',
          exitTime: (data as any).exitTime || '',
          intervalCheck: (data as any).intervalCheck || false
        }
      };
    } else if (data.event === 'authorized_entry') {
      return {
        type: 'general',
        data: {
          description: '',
          role: (data as any).role || ''
        }
      };
    } else if (data.event === 'vehicle_recognized') {
      return {
        type: 'vehicle',
        data: {
          role: (data as any).role || '',
          licensePlatePattern: ''
        }
      };
    } else {
      return {
        type: 'general',
        data: {
          description: ''
        }
      };
    }
  };

  // Submit handler
  const handleSubmit = (data: RuleFormValues) => {
    // Create the condition object
    const condition = createConditionObject(data);
    
    // Extract the camera name
    const selectedCamera = cameras.find(cam => cam.id === data.cameraId);
    const cameraName = selectedCamera?.name;

    // Build the rule object - don't include days for authorized entry and vehicle recognized
    let ruleData;
    
    if (data.event === 'authorized_entry' || data.event === 'vehicle_recognized') {
      ruleData = {
        name: data.name,
        event: data.event,
        condition,
        enabled: data.enabled,
        cameraId: data.cameraId,
        cameraName: cameraName || 'Unknown Camera'
      };
    } else {
      // For attendance and other rules, include days
      ruleData = {
        name: data.name,
        event: data.event,
        condition,
        enabled: data.enabled,
        days: data.days,
        cameraId: data.cameraId,
        cameraName: cameraName || 'Unknown Camera'
      };
    }

    onSubmit(ruleData);
  };

  return (
    <ScrollArea className="max-h-[70vh]">
      <div className="p-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Monitor Front Door Entry" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger Event</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getEventOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cameraId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Camera</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCameras ? (
                        <SelectItem value="loading" disabled>Loading cameras...</SelectItem>
                      ) : (
                        cameras.map((camera) => (
                          <SelectItem key={camera.id} value={camera.id || `camera-${camera.name}`}>
                            {camera.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Authorized entry fields */}
            {eventType === 'authorized_entry' && (
              <>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingRoles ? (
                            <SelectItem value="loading" disabled>Loading roles...</SelectItem>
                          ) : (
                            roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select which role(s) are authorized for entry
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Vehicle recognized fields */}
            {eventType === 'vehicle_recognized' && (
              <>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingRoles ? (
                            <SelectItem value="loading" disabled>Loading roles...</SelectItem>
                          ) : (
                            roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the role of people authorized to use this vehicle
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Attendance event fields */}
            {eventType === 'attendance' && (
              <>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingRoles ? (
                            <SelectItem value="loading" disabled>Loading roles...</SelectItem>
                          ) : (
                            roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="entryTimeStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Start Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="entryTimeEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry End Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="exitTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exit Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="intervalCheck"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Interval Check</FormLabel>
                        <FormDescription>
                          Check attendance at regular intervals throughout the day
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
              </>
            )}

            {/* Vehicle fields */}
            {(eventType === 'vehicle_recognized') && (
              <>
                <FormField
                  control={form.control}
                  name="vehicleRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="authorized">Authorized</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="visitor">Visitor</SelectItem>
                          <SelectItem value="restricted">Restricted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="licensePlatePattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Plate Pattern (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., AB* or specific plate number" />
                      </FormControl>
                      <FormDescription>
                        Use * as wildcard, leave empty to match any plate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {eventType !== 'authorized_entry' && eventType !== 'vehicle_recognized' && (
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active Days</FormLabel>
                    <FormDescription>
                      Select which days this rule should be active
                    </FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {daysOfWeek.map((day) => (
                        <FormField
                          key={day.id}
                          control={form.control}
                          name="days"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, day.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== day.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {day.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Rule</FormLabel>
                    <FormDescription>
                      Enable or disable this rule
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
            
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Rule"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}