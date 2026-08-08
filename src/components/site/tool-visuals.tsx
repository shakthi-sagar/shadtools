import {
  Braces,
  Calculator,
  Coins,
  FileText,
  Image,
  KeyRound,
  Ruler,
  ScanText,
  type LucideIcon,
} from 'lucide-react';

export interface NamespaceVisual {
  icon: LucideIcon;
  color: string;
  soft: string;
}

export const namespaceVisuals: Record<string, NamespaceVisual> = {
  json: { icon: Braces, color: 'text-[#5896f8]', soft: 'bg-[#2f7cf6]/12' },
  base64: { icon: ScanText, color: 'text-[#a783fa]', soft: 'bg-[#8b5cf6]/12' },
  text: { icon: FileText, color: 'text-[#4cc5a7]', soft: 'bg-[#16a085]/12' },
  images: { icon: Image, color: 'text-[#ed78a5]', soft: 'bg-[#e0568a]/12' },
  crypto: { icon: KeyRound, color: 'text-[#e3b14e]', soft: 'bg-[#d59b27]/12' },
  units: { icon: Ruler, color: 'text-[#55bec8]', soft: 'bg-[#22a6b3]/12' },
  currency: { icon: Coins, color: 'text-[#75c890]', soft: 'bg-[#4fa76f]/12' },
  percentage: { icon: Calculator, color: 'text-[#f6965d]', soft: 'bg-[#ef7a32]/12' },
};

export function getNamespaceVisual(namespace: string): NamespaceVisual {
  return namespaceVisuals[namespace] || {
    icon: Braces,
    color: 'text-accent',
    soft: 'bg-accent-subtle',
  };
}
