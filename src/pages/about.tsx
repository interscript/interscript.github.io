import React from "react";
import { HeaderMenu } from "../components/HeaderMenu";

export default () => (
    <>
    <HeaderMenu />
    <div>Interscript has been supported by:
        <ul>
            <li>

                Professor Lyubomir Ivanov (Bulgarian Academy of Sciences)
            </li>
            <li>

                BGN https://www.usgs.gov/core-science-systems/ngp/board-on-geographic-names
            </li>
            <li>
                OGC <a href="https://www.ogc.org">https://www.ogc.org</a>
            </li>
            <li>
                CalConnect <a href="https://www.calconnect.org">https://www.calconnect.org</a>
            </li>
            <li>
                UNGEGN (<a href="https://unstats.un.org/unsd/ungegn/">https://unstats.un.org/unsd/ungegn/</a>) Working Group on Romanization Systems (<a href="http://www.eki.ee/wgrs/">http://www.eki.ee/wgrs/</a>)
            </li>
        </ul>
    </div>
    </>
)
