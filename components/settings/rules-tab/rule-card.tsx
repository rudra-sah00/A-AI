"use client"

import { useState } from 'react';
import { Rule, toggleRuleStatus, deleteRule } from '@/lib/services/rulesService';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface RuleCardProps {
  rule: Rule;
  onDeleted: (ruleId: string) => void;
}

export default function RuleCard({ rule, onDeleted }: RuleCardProps) {
  // Add local state to track the enabled status
  const [isEnabled, setIsEnabled] = useState(rule.enabled);
  
  const handleToggleStatus = async () => {
    try {
      // Toggle the state first for immediate UI feedback
      const newStatus = !isEnabled;
      setIsEnabled(newStatus);
      
      // Call the API
      await toggleRuleStatus(rule.id, newStatus);
      toast.success(`Rule ${newStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      // Revert back to original state if API call fails
      setIsEnabled(isEnabled);
      console.error('Error toggling rule status:', error);
      toast.error('Failed to update rule status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRule(rule.id);
      onDeleted(rule.id);
      toast.success('Rule deleted successfully');
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete rule');
    }
  };

  // Format condition display based on type
  const renderCondition = () => {
    if (rule.condition.type === 'attendance') {
      const { role, entryTimeStart, entryTimeEnd, exitTime, intervalCheck } = rule.condition.data;
      return (
        <>
          Role: <span className="font-medium">{role}</span>
          {entryTimeStart && entryTimeEnd && <>, Entry: <span className="font-medium">{entryTimeStart} - {entryTimeEnd}</span></>}
          {exitTime && <>, Exit: <span className="font-medium">after {exitTime}</span></>}
          {intervalCheck && <>, with interval checks</>}
        </>
      );
    } else if (rule.condition.type === 'vehicle') {
      const { role, licensePlatePattern } = rule.condition.data;
      return (
        <>
          Role: <span className="font-medium">{role}</span>
          {licensePlatePattern && <>, Pattern: <span className="font-medium">{licensePlatePattern}</span></>}
        </>
      );
    } else {
      return rule.condition.data.description || 'General condition';
    }
  };

  // Format action display
  const getActionDisplay = () => {
    switch (rule.action) {
      case 'notify': return 'Send notification';
      case 'record': return 'Start recording';
      case 'trigger_alarm': return 'Trigger alarm';
      case 'custom': return 'Custom action';
      default: return rule.action;
    }
  };

  // Format event display
  const getEventDisplay = () => {
    return rule.event.replace(/_/g, ' ');
  };
  
  // Format schedule display to show days
  const formatSchedule = (rule: Rule) => {
    if (!rule.days || rule.days.length === 0) return 'No days selected';
    
    // Check if all 7 days are selected
    if (rule.days.length === 7) return 'Every day';
    
    // Format day names properly
    return rule.days.map((day: string) => {
      const firstLetter = day.charAt(0).toUpperCase();
      const rest = day.slice(1);
      return `${firstLetter}${rest}`;
    }).join(', ');
  };

  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{rule.name}</h3>
          <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          {rule.cameraName && (
            <Badge variant="outline" className="ml-2">
              {rule.cameraName}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          When <span className="font-medium">{getEventDisplay()}</span> detected,{' '}
          <span className="font-medium">{getActionDisplay()}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Condition: {renderCondition()}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Schedule: {formatSchedule(rule)}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Switch 
          checked={isEnabled} 
          onCheckedChange={handleToggleStatus}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}