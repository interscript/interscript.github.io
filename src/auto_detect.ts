import type { WritingSystemCode } from "./scs";

export interface ScriptDetectionData {
    scripts: Array<WritingSystemCode>;
    diacritization_needed: boolean;
}
