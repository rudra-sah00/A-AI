import { useState, useEffect } from 'react';

interface GeneralSettings {
  systemName: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

const defaultSettings: GeneralSettings = {
  systemName: 'SecureView AI',
  timezone: 'UTC-5',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
};

export function useGeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettings>(defaultSettings);
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem('generalSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading general settings:', error);
      }
    }
  }, []);

  return settings;
}