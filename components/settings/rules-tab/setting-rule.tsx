"use client"

import RulesSettings from './rules-settings';

interface RulesContainerProps {
  onSubmit: (data: any, name: string) => void;
  isSubmitting: boolean;
}

export default function RulesContainer({ onSubmit, isSubmitting }: RulesContainerProps) {
  return (
    <RulesSettings onSubmit={onSubmit} isSubmitting={isSubmitting} />
  );
}