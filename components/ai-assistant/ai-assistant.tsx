"use client"

import { useState, useEffect, useRef } from 'react';
import { BrainCircuit, SendHorizonal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Camera, fetchCameras } from '@/lib/services/cameraService';
import { 
  submitQuery, 
  // checkQueryStatus // Removed as it's no longer used
} from '@/lib/services/aiAssistantService';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'processing' | 'complete' | 'error';
  image_base64?: string;
}

export default function AiAssistant() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessingQuery, setIsProcessingQuery] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load cameras on component mount
  useEffect(() => {
    async function loadCameras() {
      try {
        const camerasData = await fetchCameras();
        setCameras(camerasData);
        
        // Select the first camera by default if available
        if (camerasData.length > 0 && camerasData[0].id) {
          setSelectedCamera(camerasData[0].id);
        }
      } catch (error) {
        console.error('Failed to load cameras:', error);
        toast({
          title: 'Error',
          description: 'Failed to load cameras. Please try again.',
          variant: 'destructive',
        });
      }
    }

    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'system',
        content: 'Welcome to AI Assistant! Select a camera and ask questions about what the camera sees.',
        timestamp: new Date(),
        status: 'complete'
      }
    ]);

    loadCameras();
  }, []);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to handle camera selection
  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
  };

  // Function to handle sending a query
  const handleSendQuery = async () => {
    if (!selectedCamera) {
      toast({
        title: 'Error',
        description: 'Please select a camera first.',
        variant: 'destructive',
      });
      return;
    }

    const currentQuery = query.trim(); // Capture query before clearing
    if (!currentQuery) {
      toast({
        title: 'Error',
        description: 'Please enter a query.',
        variant: 'destructive',
      });
      return;
    }

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    // Add user message
    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        role: 'user',
        content: currentQuery,
        timestamp: new Date(),
        status: 'sending'
      }
    ]);

    setQuery(""); // Clear input field
    setIsProcessingQuery(true);

    // Add assistant message placeholder (status: 'processing')
    setMessages(prev => [
      ...prev,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: 'Processing your query...',
        timestamp: new Date(),
        status: 'processing'
      }
    ]);

    try {
      // Submit query to API
      const apiResponse = await submitQuery({
        camera_id: selectedCamera,
        query: currentQuery
      });

      // Update user message status to 'complete'
      setMessages(prev => prev.map(msg => 
        msg.id === userMessageId ? { ...msg, status: 'complete' } : msg
      ));

      if (apiResponse.success) {
        // Update assistant message with successful response
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? { 
            ...msg, 
            content: apiResponse.response || 'AI processed the request but returned no specific text.',
            status: 'complete',
            image_base64: apiResponse.image_base64 // Handles if image_base64 is present or not
          } : msg
        ));
      } else {
        // Update assistant message with error from API response
        const errorMessage = apiResponse.error || 'An unknown error occurred during AI processing.';
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? { 
            ...msg, 
            content: errorMessage, 
            status: 'error' 
          } : msg
        ));
        toast({
          title: 'AI Processing Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to send query:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to the AI service or an unexpected error occurred.';

      // Update user message status to 'error'
      setMessages(prev => prev.map(msg => 
        msg.id === userMessageId ? { ...msg, status: 'error' } : msg
      ));

      // Update assistant message with the error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? { 
          ...msg, 
          content: `Error: ${errorMessage}`,
          status: 'error' 
        } : msg
      ));

      toast({
        title: 'Query Submission Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessingQuery(false);
    }
  };

  // Function to format timestamp
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-[calc(100vh-10rem)] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BrainCircuit className="h-5 w-5 mr-2" />
              AI Assistant
            </CardTitle>
            <CardDescription>
              Ask questions about what the cameras see
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Select 
              value={selectedCamera} 
              onValueChange={handleCameraChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Camera" />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id || ''}>
                    {camera.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto px-4 pb-0">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.role === 'system'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">
                    {message.role === 'user'
                      ? 'You'
                      : message.role === 'system'
                      ? 'System'
                      : 'AI Assistant'}
                  </span>
                  <span className="text-xs opacity-70">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <div className="whitespace-pre-wrap"> {/* Added whitespace-pre-wrap here */}
                  {message.content}
                  {message.status === 'processing' && (
                    <span className="ml-2 inline-flex">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </span>
                  )}
                </div>
                {message.image_base64 && (
                  <div className="mt-2">
                    <img 
                      src={`data:image/jpeg;base64,${message.image_base64}`} 
                      alt="Camera view" 
                      className="rounded-md w-full h-auto max-h-[300px] object-contain mt-2 border border-border"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="grid w-full grid-cols-12 gap-2"
        >
          <div className="col-span-10 sm:col-span-11">
            <Input
              placeholder="Ask about what the camera sees or request a photo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isProcessingQuery || !selectedCamera}
            />
          </div>
          <Button
            type="submit"
            className="col-span-2 sm:col-span-1"
            disabled={isProcessingQuery || !selectedCamera || !query.trim()}
          >
            {isProcessingQuery ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}