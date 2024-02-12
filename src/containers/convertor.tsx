import { InterscriptMetaDataMap, InterscriptMapsMetaInfo } from "../meta";
import React, { ChangeEvent, useEffect, useState } from "react";
import { LiveDemo, DemoType } from "components/LiveDemo";

const CONVERTOR_TYPE_IN_BROWSER: Array<{ name: DemoType; label: string }> = [
    { name: "RUBY", label: "WebAPI" },
    { name: "JAVASCRIPT", label: "Javascript" },
];

export const Convertor: React.FC<{
    mapsInfo: InterscriptMapsMetaInfo;
    metaDataMap: InterscriptMetaDataMap;
}> = function ({ mapsInfo, metaDataMap }) {
    const [demoTypeIndex, setDemoTypeIndex] = useState(0);

    return (
        <>
            <h2>Try it live - {`interscript in ${CONVERTOR_TYPE_IN_BROWSER[demoTypeIndex].label}`}</h2>
            <p>
                We have 2 demos for converting, which one is using Web API and the other one is Javascript.
                <br />
                You can choose one &nbsp;
                <select
                    onChange={(evt: ChangeEvent<HTMLSelectElement>) => {
                        setDemoTypeIndex(evt.target.selectedIndex);
                    }}
                >
                    {CONVERTOR_TYPE_IN_BROWSER.map((ctype, ind) => {
                        return (
                            <option key={ctype.name} value={ctype.name} defaultChecked={ind === 0}>
                                {ctype.label}
                            </option>
                        );
                    })}
                </select>
            </p>
            {CONVERTOR_TYPE_IN_BROWSER[demoTypeIndex].name === "RUBY" ? (
                <p>
                    {`Interscript provides ${mapsInfo?.meta.total} script conversion systems via its Ruby API from`}
                    &nbsp;
                    <a href="https://github.com/interscript/interscript-api" target="_BLANK">
                        interscript-api
                    </a>
                    .
                </p>
            ) : (
                <p>
                    {`Interscript provides ${mapsInfo?.meta.total} script conversion systems in JavaScript through `}
                    <a href="https://github.com/interscript/interscript-js" target="_BLANK">
                        interscript.js
                    </a>
                    {"."}
                </p>
            )}
            <LiveDemo
                maps={mapsInfo.data}
                metaData={metaDataMap}
                demoType={CONVERTOR_TYPE_IN_BROWSER[demoTypeIndex].name}
            />
        </>
    );
};

export default Convertor;
