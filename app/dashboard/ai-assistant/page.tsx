import AiAssistant from '@/components/ai-assistant/ai-assistant';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Assistant | A-AI Security',
  description: 'Ask questions about what your cameras see in real-time',
};

export default function AiAssistantPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>
        <AiAssistant />
      </div>
    </div>
  );
}