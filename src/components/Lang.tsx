import { getLanguageTitleFrom6392or3 } from 'components/isoLang';

const Lang = function (code: string): string {
  const lang = getLanguageTitleFrom6392or3(code);

  if (!lang) {
    console.error('Unsupported ISO 639-2 3-letter language code', code);
    return code;
  }

  return lang;
};

export default Lang;
