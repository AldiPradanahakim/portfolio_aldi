import {
  BarChart3,
  Cloud,
  Code2,
  Cpu,
  CreditCard,
  Database,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Smartphone,
  Sparkles,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/** Content stores lucide icon names as strings; resolve them through a record, never a dynamic index. */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  Code2,
  Smartphone,
  Database,
  Cpu,
  CreditCard,
  BarChart3,
  Cloud,
  Wrench,
};

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
};

export const serviceIcon = (name: string): LucideIcon => SERVICE_ICONS[name] ?? Sparkles;
export const socialIcon = (icon: string): LucideIcon => SOCIAL_ICONS[icon] ?? Mail;
