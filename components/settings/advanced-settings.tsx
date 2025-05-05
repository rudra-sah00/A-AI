"use client"

import { useState } from "react";
import { Loader2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AdvancedSettingsProps {
  onSave: () => void;
  isSubmitting: boolean;
}

export default function AdvancedSettings({ onSave, isSubmitting }: AdvancedSettingsProps) {
  // State for various advanced settings
  const [apiAccess, setApiAccess] = useState(false);
  const [smartHomeIntegration, setSmartHomeIntegration] = useState(true);
  const [externalAuth, setExternalAuth] = useState(false);
  const [detectionSensitivity, setDetectionSensitivity] = useState(3);
  const [updateBehavior, setUpdateBehavior] = useState("prompt");

  // Detection types toggles
  const [detectionTypes, setDetectionTypes] = useState({
    motion: true,
    person: true,
    vehicle: true,
    face: true,
    object: true,
    sound: false,
  });

  const handleSubmit = () => {
    const advancedSettings = {
      integrations: {
        apiAccess,
        smartHomeIntegration,
        externalAuth,
      },
      aiEngine: {
        detectionSensitivity,
        detectionTypes,
      },
      system: {
        updateBehavior,
      }
    };

    console.log(advancedSettings);
    onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>
          Configure system-level settings and integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Integration Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">API Access</h4>
                <p className="text-sm text-muted-foreground">Enable third-party API access</p>
              </div>
              <Switch 
                checked={apiAccess} 
                onCheckedChange={setApiAccess} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Smart Home Integration</h4>
                <p className="text-sm text-muted-foreground">Connect with smart home platforms</p>
              </div>
              <Switch 
                checked={smartHomeIntegration} 
                onCheckedChange={setSmartHomeIntegration}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">External Authentication</h4>
                <p className="text-sm text-muted-foreground">Allow OAuth and SSO providers</p>
              </div>
              <Switch 
                checked={externalAuth} 
                onCheckedChange={setExternalAuth}
              />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">AI Engine Settings</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Detection Sensitivity</h4>
                <span className="text-sm font-medium">
                  {detectionSensitivity === 1 && "Very Low"}
                  {detectionSensitivity === 2 && "Low"}
                  {detectionSensitivity === 3 && "Medium"}
                  {detectionSensitivity === 4 && "High"}
                  {detectionSensitivity === 5 && "Very High"}
                </span>
              </div>
              <div className="mt-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={detectionSensitivity}
                  onChange={(e) => setDetectionSensitivity(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="font-medium mb-2">Detection Types</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="motion" 
                    checked={detectionTypes.motion}
                    onCheckedChange={(checked) => 
                      setDetectionTypes({...detectionTypes, motion: !!checked})
                    }
                  />
                  <label
                    htmlFor="motion"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Motion Detection
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="person" 
                    checked={detectionTypes.person}
                    onCheckedChange={(checked) => 
                      setDetectionTypes({...detectionTypes, person: !!checked})
                    }
                  />
                  <label
                    htmlFor="person"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Person Detection
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vehicle" 
                    checked={detectionTypes.vehicle}
                    onCheckedChange={(checked) => 
                      setDetectionTypes({...detectionTypes, vehicle: !!checked})
                    }
                  />
                  <label
                    htmlFor="vehicle"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vehicle Detection
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="face" 
                    checked={detectionTypes.face}
                    onCheckedChange={(checked) => 
                      setDetectionTypes({...detectionTypes, face: !!checked})
                    }
                  />
                  <label
                    htmlFor="face"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Face Recognition
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="object" 
                    checked={detectionTypes.object}
                    onCheckedChange={(checked) => 
                      setDetectionTypes({...detectionTypes, object: !!checked})
                    }
                  />
                  <label
                    htmlFor="object"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Object Detection
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sound" 
                    checked={detectionTypes.sound}
                    onCheckedChange={(checked) => 
                      setDetectionTypes({...detectionTypes, sound: !!checked})
                    }
                  />
                  <label
                    htmlFor="sound"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Sound Detection
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">System Maintenance</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Automatic Updates</h4>
              <Select value={updateBehavior} onValueChange={setUpdateBehavior}>
                <SelectTrigger>
                  <SelectValue placeholder="Select update behavior" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Install automatically</SelectItem>
                  <SelectItem value="prompt">Prompt before installing</SelectItem>
                  <SelectItem value="manual">Manual updates only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <h4 className="font-medium mb-2">System Recovery</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline">
                  Create Backup
                </Button>
                <Button variant="outline">
                  Restore
                </Button>
                <Button variant="outline" className="text-destructive">
                  Factory Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save advanced settings"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}