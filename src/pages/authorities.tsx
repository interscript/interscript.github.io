import React from "react";
import { Link } from "@reach/router";
import authority_data from "../authority.json";

// @ts-ignore
const ary = Object.keys(authority_data).map((k) => authority_data[k]);

export default () => {
    const authorityData = ary.map((item) => (
        <dl key={item.code}>
            <dt>
                <code>{item.code.toUpperCase()}</code>
            </dt>
            <dd>
                <Link to={`/authorities/${item.code}`}>{item.name.en}</Link>
            </dd>
        </dl>
    ));
    const total = authorityData.length;

    return (
        <div>
            <h2>Authorities ({total})</h2>
            <ul> {authorityData} </ul>
        </div>
    );
};
