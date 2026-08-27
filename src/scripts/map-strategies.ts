/**
 * Shared map-loading strategy stack for every browser runtime entry
 * point (worker, widget, component islands).
 *
 * ISC maps resolve first. The compiled JSON fallback exists only for
 * the .iml libraries (posix, unicode, var-Cyrl, var-kor), which have
 * no ISC form — maps depending on them would otherwise fail to load.
 */
import { httpStrategy, iscStrategy, type LoadStrategy } from "interscript"

export function mapStrategies(): LoadStrategy[] {
  return [
    iscStrategy({ baseUrl: "/maps" }),
    httpStrategy({ baseUrl: "/maps", cacheKeyPrefix: "isx-libs:" }),
  ]
}
