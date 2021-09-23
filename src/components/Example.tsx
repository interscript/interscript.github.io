import React, { useState } from "react";
import { ScriptConversionExample } from "types/index";
import { ScriptConversionSystem } from "../scs";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const cap = (str: string): string =>
    str
        .split(" ")
        .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
        .join(" ");

interface ScriptConversionView extends ScriptConversionExample {
    scs?: ScriptConversionSystem;
}

export const English: React.FC<{
    samples: any;
}> = function ({ samples }) {
    return (
        <>
            {!!samples && (
                <span>
                    {" "}
                    [<i>{samples}</i>]
                </span>
            )}
        </>
    );
};

export const Sample: React.FC<{
    data: ScriptConversionExample;
    years?: number[];
    authority?: string;
    setYear?: Function;
    selected?: number;
}> = function ({ data: s, years, authority, setYear, selected = 0 }) {
    const aggr: boolean = years && years.length > 1;
    let isoName = s.isoName;
    if (aggr && authority) {
        isoName = authority + " ";
    }

    if (authority === "OGC" || s.ogc11122) {
        isoName = s.ogc11122;
    }

    const yearNavs = years?.map((id, index) => (
        <YearNavItem
            href="javascript:void(0)"
            onClick={() => setYear(index)}
            key={index}
            style={{ fontWeight: index === selected ? "bolder" : null }}
        >
            {id}
        </YearNavItem>
    ));

    const isSystemAvailable = () => !!s.systemName;
    const hasResult = () => !!s.result.length;

    const enableSystemExternalLink = () => (
        <a href={`/systems/${s.systemName}`} target="_blank">
            {/*<i className="fas fa-external-link-alt"></i>*/}
            <FontAwesomeIcon icon={faExternalLinkAlt} />
        </a>
    );

    const systemNote = () => {
        if (isSystemAvailable() && hasResult()) {
            return "";
        }

        if (!isSystemAvailable()) {
            return " (To be implemented)";
        }

        if (!hasResult()) {
            return " (Regenerate)";
        }
    };

    return (
        <div>
            <SampleTitle>
                <strong style={{ color: "#002060" }}>{s.lang}</strong> [{isoName}
                {aggr && yearNavs}] {isSystemAvailable() && enableSystemExternalLink()}
            </SampleTitle>
            <p>
                {s.samples.map((e: string, i: number) => (
                    <span key={i}>
                        {`${e} ${s.result[i] ? cap(s.result[i]) : ""}`}
                        {s.english && !!s.english[i] && <English samples={s.english[i]} />}
                        {i + 1 < s.samples.length && ", "}
                    </span>
                ))}
                <i>{systemNote()}</i>
            </p>
        </div>
    );
};

export const AggrSample: React.FC<{
    data: ScriptConversionView[];
    authority: string;
}> = function ({ data, authority }) {
    const [sel, setSel] = useState(0);
    const ids = data.map((e) => e.year).sort((a, b) => b - a);
    const findDataByIndex = () => data.find((e) => e.year === ids[sel]);

    return (
        <div>
            {ids.length > 1 ? (
                <Sample data={findDataByIndex()} years={ids} authority={authority} setYear={setSel} selected={sel} />
            ) : ids.length === 1 ? (
                <Sample data={data[0]} />
            ) : null}
        </div>
    );
};

// const YearNav = styled.nav`
//   margin-bottom: -1rem;
// `
const SampleTitle = styled.p`
    & > a:last-child {
        margin-right: 0;
    }
`;
const YearNavItem = styled.a`
    cursor: pointer;

    &,
    &:link,
    &:visited {
        border-bottom: none;
    }

    &:active,
    &:visited,
    &:hover,
    &:focus {
        font-weight: bolder;
    }

    margin-right: 0.25rem;
`;

export const Poster: React.FC<{
    data: ScriptConversionExample[];
    authority: string;
    aggregate?: boolean;
}> = function ({ data, authority, aggregate = false }) {
    const groupByLang = () =>
        data.reduce((r: any, a: ScriptConversionExample) => {
            r[a.lang] = r[a.lang] || [];
            r[a.lang].push(a);
            return r;
        }, Object.create(null));

    let left, right;
    if (aggregate) {
        const result: any = groupByLang();
        const langs: string[] = Object.keys(result);
        const genSample = (lang: string, i: number) => <AggrSample data={result[lang]} authority={authority} key={i} />;
        left = langs.slice(0, langs.length / 2).map(genSample);
        right = langs.slice(langs.length / 2, langs.length).map(genSample);
    } else {
        const genSample = (s: ScriptConversionExample, index: number) => <Sample data={s} key={index} />;
        left = data.slice(0, data.length / 2).map(genSample);
        right = data.slice(data.length / 2, data.length).map(genSample);
    }

    return (
        <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>{left}</div>
            <div style={{ flex: 1 }}>{right}</div>
        </div>
    );
};
