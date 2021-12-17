import React, { useState } from "react";
import { useRouteData } from "react-static";
import { InterscriptMetaDataMap } from "../meta";
import { systemFromCode } from "../scs";
import { Link } from "@reach/router";

export default () => {
    const { authorityCode } = useRouteData();
    const {
        mapsInfo,
        metaDataMap,
    }: {
        mapsInfo: any;
        metaDataMap: InterscriptMetaDataMap;
    } = useRouteData();

    const formatName = (name: string): string => {
        const MAX_LENGTH = 120;
        if (name.length >= MAX_LENGTH) {
            name = name.substring(0, MAX_LENGTH) + "...";
        }

        return name; //.toUpperCase();
    };

    const list: string[] = mapsInfo.data
        .sort()
        .filter((x: string) => systemFromCode(x).authority === authorityCode)
        .map((system: string) => (
            <dl key={system}>
                <dt>
                    <Link to={`/systems/${system}`} key={system}>
                        {<code>{system}</code>}
                    </Link>{" "}
                    (<code>{metaDataMap[system].sourceScript}</code> {" to "}
                    <code>{metaDataMap[system].destinationScript}</code>)
                </dt>
                <dd>
                    <Link to={`/systems/${system}`} key={system}>
                        {formatName(metaDataMap[system].name)}
                    </Link>
                </dd>
            </dl>
        ));
    return <div>{list}</div>;
};
