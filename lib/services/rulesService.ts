/**
 * Rules Service - Handles API calls related to automation rules management
 */

import { Camera } from './cameraService';

// Type definitions for rule data
export type RuleAction = 'notify' | 'record' | 'trigger_alarm' | 'custom';
export type RuleEvent = 'authorized_entry' | 'attendance' | 'face_recognized' | 'face_unknown' | 'vehicle_recognized' | 'unknown_vehicle';

// Role types
export type AttendanceRole = 'employee' | 'visitor' | 'contractor' | 'student';
export type VehicleRole = 'authorized' | 'delivery' | 'employee' | 'visitor' | 'restricted';

// Attendance condition type
export type AttendanceCondition = {
  role: AttendanceRole;
  entryTimeStart?: string; // Format: "HH:MM"
  entryTimeEnd?: string; // Format: "HH:MM"
  exitTime?: string; // Format: "HH:MM"
  intervalCheck?: boolean;
};

// Vehicle condition type
export type VehicleCondition = {
  role: VehicleRole;
  licensePlatePattern?: string;
};

// Union type for all possible conditions
export type RuleCondition = 
  | { type: 'attendance', data: AttendanceCondition }
  | { type: 'vehicle', data: VehicleCondition }
  | { type: 'general', data: { description: string } };

// Rule definition
export interface Rule {
  id: string;
  name: string;
  cameraId?: string; // Optional, if null applies to all cameras
  cameraName?: string; // For display purposes
  event: RuleEvent;
  condition: RuleCondition;
  action: RuleAction;
  enabled: boolean;
  schedule: string;
  days: string[]; // Array of selected days
}

// Backend API base URL (same as camera service)
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Fetches all rules from the backend API
 */
export const fetchRules = async (): Promise<Rule[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rules/`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch rules:', error);
    // For demo purposes, return from localStorage if available
    if (typeof window !== 'undefined') {
      const savedRules = localStorage.getItem('rules');
      if (savedRules) {
        try {
          return JSON.parse(savedRules);
        } catch (e) {
          console.error('Error parsing saved rules:', e);
        }
      }
    }
    return [];
  }
};

/**
 * Fetches rules for a specific camera
 */
export const fetchRulesByCameraId = async (cameraId: string): Promise<Rule[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}/rules`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch rules for camera ${cameraId}:`, error);
    // For demo purposes, filter from localStorage
    const allRules = await fetchRules();
    return allRules.filter(rule => rule.cameraId === cameraId);
  }
};

/**
 * Adds a new rule
 */
export const addRule = async (rule: Omit<Rule, 'id'>): Promise<Rule> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rules/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to add rule:', error);
    
    // For demo purposes, generate ID and save to localStorage
    const newRule = {
      ...rule,
      id: `rule-${Date.now().toString(36)}`
    };
    
    if (typeof window !== 'undefined') {
      const savedRules = localStorage.getItem('rules');
      let rules: Rule[] = [];
      
      if (savedRules) {
        try {
          rules = JSON.parse(savedRules);
        } catch (e) {
          console.error('Error parsing saved rules:', e);
        }
      }
      
      rules.push(newRule);
      localStorage.setItem('rules', JSON.stringify(rules));
    }
    
    return newRule;
  }
};

/**
 * Updates an existing rule
 */
export const updateRule = async (ruleId: string, rule: Partial<Rule>): Promise<Rule> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rules/${ruleId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update rule ${ruleId}:`, error);
    
    // For demo purposes, update in localStorage
    if (typeof window !== 'undefined') {
      const savedRules = localStorage.getItem('rules');
      if (savedRules) {
        try {
          let rules: Rule[] = JSON.parse(savedRules);
          rules = rules.map(r => r.id === ruleId ? { ...r, ...rule } : r);
          localStorage.setItem('rules', JSON.stringify(rules));
          return rules.find(r => r.id === ruleId) as Rule;
        } catch (e) {
          console.error('Error updating local rules:', e);
        }
      }
    }
    
    throw error;
  }
};

/**
 * Deletes a rule
 */
export const deleteRule = async (ruleId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rules/${ruleId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to delete rule ${ruleId}:`, error);
    
    // For demo purposes, delete from localStorage
    if (typeof window !== 'undefined') {
      const savedRules = localStorage.getItem('rules');
      if (savedRules) {
        try {
          let rules: Rule[] = JSON.parse(savedRules);
          rules = rules.filter(r => r.id !== ruleId);
          localStorage.setItem('rules', JSON.stringify(rules));
        } catch (e) {
          console.error('Error deleting local rule:', e);
        }
      }
    }
  }
};

/**
 * Generates event options for rule creation based on available AI filters
 */
export const getEventOptions = (): { value: RuleEvent; label: string }[] => {
  return [
    { value: 'authorized_entry', label: 'Authorized Entry' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'face_recognized', label: 'Face Recognized' },
    { value: 'face_unknown', label: 'Unknown Face' },
    { value: 'vehicle_recognized', label: 'Vehicle Recognized' },
    { value: 'unknown_vehicle', label: 'Unknown Vehicle' }
  ];
};

/**
 * Toggle rule enabled status
 */
export const toggleRuleStatus = async (ruleId: string, enabled: boolean): Promise<Rule> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rules/${ruleId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update rule status ${ruleId}:`, error);
    
    // For demo purposes, update in localStorage
    if (typeof window !== 'undefined') {
      const savedRules = localStorage.getItem('rules');
      if (savedRules) {
        try {
          let rules: Rule[] = JSON.parse(savedRules);
          rules = rules.map(r => r.id === ruleId ? { ...r, enabled } : r);
          localStorage.setItem('rules', JSON.stringify(rules));
          return rules.find(r => r.id === ruleId) as Rule;
        } catch (e) {
          console.error('Error updating local rules:', e);
        }
      }
    }
    
    throw error;
  }
};