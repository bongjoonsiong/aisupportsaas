import { en } from './en';
import { zhCN } from './zh-CN';
import { zhTW } from './zh-TW';
import { es } from './es';
import { ja } from './ja';
import { LocaleSchema } from './types';

export type SupportedLanguage = 'en' | 'zh-CN' | 'zh-TW' | 'es' | 'ja';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇭🇰' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

export const locales: Record<SupportedLanguage, LocaleSchema> = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  es,
  ja,
};

export * from './types';
