import {
  Atom,
  Binary,
  BrainCircuit,
  Brain,
  Cpu,
  Dna,
  Drama,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  Leaf,
  Lightbulb,
  Map,
  Microscope,
  Music2,
  Palette,
  PawPrint,
  PersonStanding,
  Rocket,
  ScrollText,
  Sigma,
  Stethoscope,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryId } from '@/types/fact';

/** Mapowanie kategorii na jednokolorowe ikony outline (lucide-react). */
export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  science: Microscope,
  space: Rocket,
  history: Landmark,
  psychology: Brain,
  biology: Dna,
  medicine: Stethoscope,
  physics: Atom,
  chemistry: FlaskConical,
  mathematics: Sigma,
  geography: Map,
  technology: Cpu,
  computerScience: Binary,
  ai: BrainCircuit,
  archaeology: ScrollText,
  language: Languages,
  culture: Drama,
  art: Palette,
  music: Music2,
  sport: Trophy,
  animals: PawPrint,
  plants: Leaf,
  society: Users,
  economy: TrendingUp,
  inventions: Lightbulb,
  earth: Globe,
  human: PersonStanding,
};

interface CategoryIconProps {
  category: CategoryId;
  size?: number;
  className?: string;
}

export function CategoryIcon({ category, size = 16, className }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[category];
  return <Icon size={size} aria-hidden="true" className={className} strokeWidth={2} />;
}
