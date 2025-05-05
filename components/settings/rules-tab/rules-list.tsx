"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Plus, Loader2, Camera as CameraIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchRules, fetchRulesByCameraId, Rule } from '@/lib/services/rulesService';
import { fetchCameras, Camera as CameraType } from '@/lib/services/cameraService';
import { useToast } from '@/hooks/use-toast';
import RuleCard from './rule-card';

interface RulesListProps {
  onAddRule: () => void;
}

const RulesList = forwardRef<{ loadRules: () => Promise<void> }, RulesListProps>(({ onAddRule }, ref) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [cameras, setCameras] = useState<CameraType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadRules = async () => {
    setLoading(true);
    try {
      const rulesData = await fetchRules();
      setRules(rulesData);
    } catch (error) {
      console.error('Failed to load rules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load automation rules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Expose loadRules method through ref
  useImperativeHandle(ref, () => ({
    loadRules,
  }));

  // Load rules and cameras on component mount
  useEffect(() => {
    loadRules();
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      const camerasData = await fetchCameras();
      setCameras(camerasData);
    } catch (error) {
      console.error('Failed to load cameras:', error);
    }
  };

  const handleRuleDeleted = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>
            Configure advanced event-based automation rules
          </CardDescription>
        </div>
        <Button onClick={onAddRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center p-6 border rounded-lg border-dashed">
            <CameraIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-4">
              No automation rules configured yet
            </p>
            <Button variant="outline" onClick={onAddRule}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Rule
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                onDeleted={handleRuleDeleted}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

RulesList.displayName = "RulesList";
export default RulesList;