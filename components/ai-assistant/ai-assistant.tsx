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
  checkQueryStatus
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

    if (!query.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a query.',
        variant: 'destructive',
      });
      return;
    }

    const messageId = `query-${Date.now()}`;
    
    // Add user message
    setMessages(prev => [
      ...prev,
      {
        id: messageId,
        role: 'user',
        content: query,
        timestamp: new Date(),
        status: 'sending'
      }
    ]);

    setQuery("");
    setIsProcessingQuery(true);

    try {
      // Submit query to API
      const response = await submitQuery({
        camera_id: selectedCamera,
        query: query.trim()
      });

      // Add assistant message placeholder
      const assistantMessageId = `assistant-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: response.status === 'completed' 
            ? response.response || 'Processing complete.'
            : 'Processing your query...',
          timestamp: new Date(),
          status: response.status === 'completed' ? 'complete' : 'processing',
          image_base64: response.image_base64
        }
      ]);

      // Update message status
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'complete' } : msg
      ));

      // If query is still processing, poll for updates
      if (response.status === 'processing') {
        pollQueryStatus(response.query_id, selectedCamera, assistantMessageId);
      }
    } catch (error) {
      console.error('Failed to send query:', error);
      
      // Update message status to error
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'error' } : msg
      ));

      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'system',
          content: 'Failed to process your query. Please try again.',
          timestamp: new Date(),
          status: 'error'
        }
      ]);

      toast({
        title: 'Error',
        description: 'Failed to process your query. Please try again.',
        variant: 'destructive',
      });
      
      setIsProcessingQuery(false);
    }
  };

  // Function to poll for query status
  const pollQueryStatus = async (queryId: string, cameraId: string, messageId: string) => {
    try {
      const response = await checkQueryStatus(queryId, cameraId);

      if (response.status === 'completed') {
        // Update assistant message with response
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { 
            ...msg, 
            content: response.response || 'No response from AI.', 
            status: 'complete',
            image_base64: response.image_base64
          } : msg
        ));
        
        setIsProcessingQuery(false);
      } else if (response.status === 'processing') {
        // Continue polling after delay
        setTimeout(() => {
          pollQueryStatus(queryId, cameraId, messageId);
        }, 2000); // Poll every 2 seconds
      } else {
        // Query not found or other error
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { 
            ...msg, 
            content: 'Query processing failed.', 
            status: 'error' 
          } : msg
        ));
        
        setIsProcessingQuery(false);
      }
    } catch (error) {
      console.error('Failed to check query status:', error);
      
      // Update assistant message with error
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { 
          ...msg, 
          content: 'Failed to get response. Please try again.', 
          status: 'error' 
        } : msg
      ));
      
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
                <div>
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