import React from "react";
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
                <code>{item.name.en}</code>
            </dd>
        </dl>
    ));
    const total = authorityData.length;

    return (
        <div>
            <h2>{total} of authorities </h2>
            <ul> {authorityData} </ul>
        </div>
    );
};
