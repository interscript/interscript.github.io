import iso15924_data from '@riboseinc/iso-15924/index-by-code.json';
import { WritingSystemCode } from '../scs';

const WritingSystem = function (code: WritingSystemCode): string {
  const system: { Code: string; 'English Name': string } | undefined =
    iso15924_data[code];

  if (!system) {
    console.error('Unsupported ISO 15924 writing system code', code);
    return code;
  }

  return system['English Name'];
};

export default WritingSystem;
