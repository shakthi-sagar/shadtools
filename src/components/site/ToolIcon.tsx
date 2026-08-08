import React from 'react';
import {
  ArrowDownAZ,
  Binary,
  Braces,
  Calculator,
  CaseSensitive,
  CircleDollarSign,
  Clock3,
  FileImage,
  Fingerprint,
  Gauge,
  GitCompareArrows,
  HardDrive,
  KeyRound,
  Link,
  Percent,
  Ruler,
  Scale,
  Square,
  TextCursorInput,
  Thermometer,
  Wrench,
} from 'lucide-react';

export interface ToolIconProps {
  id?: string;
  namespace: string;
  className?: string;
}

const namespaceStyles: Record<string, string> = {
  base64: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
  crypto: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  currency: 'bg-green-500/10 text-green-700 dark:text-green-300',
  images: 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
  json: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  percentage: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  text: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  units: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
};

const getIcon = (id: string, namespace: string) => {
  const key = id.toLowerCase();
  if (key.includes('json')) return Braces;
  if (key.includes('base64')) return Binary;
  if (key.includes('hash')) return Fingerprint;
  if (key.includes('uuid')) return KeyRound;
  if (key.includes('currency')) return CircleDollarSign;
  if (key.includes('image')) return FileImage;
  if (key.includes('percentage')) return Percent;
  if (key.includes('diff')) return GitCompareArrows;
  if (key.includes('word-counter')) return TextCursorInput;
  if (key.includes('case-converter')) return CaseSensitive;
  if (key.includes('url-encoder')) return Link;
  if (key.includes('sort-lines')) return ArrowDownAZ;
  if (key.includes('temperature')) return Thermometer;
  if (key.includes('weight')) return Scale;
  if (key.includes('length')) return Ruler;
  if (key.includes('area')) return Square;
  if (key.includes('speed')) return Gauge;
  if (key.includes('time')) return Clock3;
  if (key.includes('data-storage')) return HardDrive;
  if (namespace === 'percentage') return Calculator;
  return Wrench;
};

export const ToolIcon: React.FC<ToolIconProps> = ({ id = '', namespace, className = '' }) => {
  const Icon = getIcon(id, namespace);

  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${namespaceStyles[namespace] || 'bg-accent-subtle text-accent'} ${className}`}
      aria-hidden="true"
    >
      <Icon className="h-5 w-5" strokeWidth={1.8} />
    </span>
  );
};
