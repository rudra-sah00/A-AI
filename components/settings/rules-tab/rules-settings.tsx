"use client"

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import RulesList from './rules-list';
import RuleForm from './rule-form';
import { addRule, Rule } from '@/lib/services/rulesService';
import { toast } from 'sonner';

interface RulesSettingsProps {
  onSubmit: (data: any, name: string) => void;
  isSubmitting: boolean;
}

export default function RulesSettings({ onSubmit, isSubmitting }: RulesSettingsProps) {
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const rulesListRef = useRef<{ loadRules: () => Promise<void> } | null>(null);

  const handleAddRule = async (data: Omit<Rule, 'id'>) => {
    try {
      // Add the rule
      const newRule = await addRule(data);
      
      // Notify the parent
      onSubmit({ rule: newRule }, 'rules');
      
      // Close dialog and show success message
      setIsAddRuleOpen(false);
      toast.success('Rule added successfully');
      
      // Refresh rules list immediately
      if (rulesListRef.current) {
        rulesListRef.current.loadRules();
      }
    } catch (error) {
      console.error('Failed to add rule:', error);
      toast.error('Failed to add rule');
    }
  };

  return (
    <div className="space-y-6">
      <RulesList 
        onAddRule={() => setIsAddRuleOpen(true)}
        ref={rulesListRef}
      />

      {/* Add Rule Dialog - Note the increased max-width and h-auto */}
      <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-auto overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Automation Rule</DialogTitle>
            <DialogDescription>
              Configure a new event-based automation rule for your security system
            </DialogDescription>
          </DialogHeader>
          
          <RuleForm 
            onSubmit={handleAddRule} 
            isSubmitting={isSubmitting} 
            onCancel={() => setIsAddRuleOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}