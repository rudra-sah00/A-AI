"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UploadCloud, 
  PlayCircle, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Filter {
  id: string;
  name: string;
  description: string;
  type: string;
}

export default function TestPage() {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFilters = async () => {
      setLoadingFilters(true);
      try {
        // Mocked API response - replace with actual API call
        const response = await new Promise<Filter[]>(resolve => 
          setTimeout(() => resolve([
            { id: '1', name: 'Object Counter', description: 'Count objects in video', type: 'counter' },
            { id: '2', name: 'Vehicle Detector', description: 'Identify vehicles in video', type: 'detector' },
            { id: '3', name: 'Bag Counter', description: 'Count bags in video', type: 'counter' },
            { id: '4', name: 'People Counter', description: 'Count people in video', type: 'counter' }
          ]), 800)
        );
        setFilters(response);
      } catch (error) {
        console.error('Error fetching filters:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load available filters",
        });
      } finally {
        setLoadingFilters(false);
      }
    };
    
    fetchFilters();
  }, [toast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check file type
      if (!file.type.includes('video/')) {
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: "Please upload a video file",
        });
        return;
      }
      
      setUploadedVideo(file);
      
      // Create a URL for the video preview
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      toast({
        title: "Video uploaded",
        description: `${file.name} is ready for processing`,
      });
    }
  };

  const handleSubmit = async () => {
    if (!uploadedVideo) {
      toast({
        variant: "destructive",
        title: "No video",
        description: "Please upload a video first",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "No prompt",
        description: "Please enter a question or prompt",
      });
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      // Mocked API processing - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on prompt keywords
      let mockResponse = "Analysis complete.";
      if (prompt.toLowerCase().includes('bag') || prompt.toLowerCase().includes('bags')) {
        mockResponse = "I detected 12 gunny bags in the video.";
      } else if (prompt.toLowerCase().includes('car') || prompt.toLowerCase().includes('vehicle')) {
        mockResponse = "I found 5 vehicles in the video: 3 sedans and 2 SUVs. All vehicles match the database records.";
      } else if (prompt.toLowerCase().includes('people') || prompt.toLowerCase().includes('person')) {
        mockResponse = "I detected 8 people in the video footage.";
      }
      
      setResult(mockResponse);
      toast({
        title: "Processing complete",
        description: "Video analysis has finished",
      });
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "There was an error analyzing your video",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const resetForm = () => {
    setUploadedVideo(null);
    setVideoUrl(null);
    setPrompt('');
    setResult(null);
    setSelectedFilter('');
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Video Analysis Test</h1>
        <p className="text-muted-foreground mt-2">
          Upload a video and ask AI to analyze specific elements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Video Upload</CardTitle>
            <CardDescription>Select a video file to analyze</CardDescription>
          </CardHeader>
          <CardContent>
            {!videoUrl ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
                <Input 
                  id="video-upload" 
                  type="file" 
                  accept="video/*"
                  className="mt-4 mx-auto max-w-xs"
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden bg-black aspect-video">
                  <video 
                    src={videoUrl} 
                    className="w-full h-full object-contain" 
                    controls
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {uploadedVideo?.name} ({Math.round((uploadedVideo?.size || 0) / 1024 / 1024 * 10) / 10} MB)
                  </p>
                  <Button variant="outline" size="sm" onClick={() => {
                    setUploadedVideo(null);
                    setVideoUrl(null);
                  }}>
                    Replace
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Filters</CardTitle>
            <CardDescription>Select a filter to apply</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingFilters ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a filter" />
                </SelectTrigger>
                <SelectContent>
                  {filters.map(filter => (
                    <SelectItem key={filter.id} value={filter.id}>
                      {filter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedFilter && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium">
                  {filters.find(f => f.id === selectedFilter)?.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {filters.find(f => f.id === selectedFilter)?.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Prompt</CardTitle>
          <CardDescription>Ask a specific question about the video</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Example: How many gunny bags can you count in this video? or What types of cars do you see in the video?"
            className="min-h-[100px] resize-none"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!uploadedVideo || !prompt.trim() || processing}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Run Analysis
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-md">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium mb-2">AI Response:</p>
                  <p>{result}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}