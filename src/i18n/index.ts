import US_EN from './locales/us-en';
import { enUS, id, ptBR, pt } from 'date-fns/locale';
import { APP_LOCALE } from '@/app/config';

export type I18N = typeof US_EN;

export type I18NDeepPartial = {
  [key in keyof I18N]?: Partial<I18N[key]>;
}

const localeTextImports: Record<
  string,
  () => Promise<I18NDeepPartial | undefined>
> = {
  'pt-br': () => import('./locales/pt-br').then(m => m.default),
  'pt-pt': () => import('./locales/pt-pt').then(m => m.default),
  'id-id': () => import('./locales/id-id').then(m => m.default),
};

const getDateFnLocale = (locale: string) => {
  switch (locale) {
  case 'id-id': return id;
  case 'pt-pt': return pt;
  case 'pt-br': return ptBR;
  default: return enUS;
  }
};

export const getTextForLocale = async (locale: string): Promise<I18N> => {
  const text = US_EN;

  Object.entries(await localeTextImports[locale.toLocaleLowerCase()]?.() ?? {})
    .forEach(([key, value]) => {
      // Fall back to English for missing keys
      text[key as keyof I18N] = {
        ...text[key as keyof I18N],
        ...value as any,
      };
    });

  return text;
};

export const DATE_FN_LOCALE = getDateFnLocale(APP_LOCALE);
