"use client"

import { UserList } from '@/components/settings/user-tab/user-list';

interface UserSettingsProps {
  onSubmit: (formData: any, formName: string) => void;
  isSubmitting: boolean;
}

export function UserSettings({ onSubmit, isSubmitting }: UserSettingsProps) {
  return <UserList onSubmit={(data) => onSubmit(data, 'user')} isSubmitting={isSubmitting} />;
}

export default UserSettings;