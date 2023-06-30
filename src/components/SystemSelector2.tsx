import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import iso15924_data from "@riboseinc/iso-15924/index-by-code.json";
import { primaryColor } from "../App";
import { systemFromCode, ScriptConversionSystem, WritingSystemCode } from "../scs";
import { getLanguageTitleFrom6392or3 } from "components/isoLang";

const { getTargetScriptByWeight, getLatestSystem } = require("../priority");
const { detectLanguage, detectAllLanguage } = require("../detect_lang.js");

function getSortedUniqueValues<T, K extends keyof T>(array: T[], key: K): T[K][] {
    const arr: T[K][] = Array.from(new Set(array.map((i) => i[key]))).filter((v) => v !== undefined);
    arr.sort();
    return arr;
}

export const SystemSelector2: React.FC<{
    onSelect: (system: ScriptConversionSystem | null) => void;
    systemCodes: string[];
    sourceScript?: WritingSystemCode;
    availableSourceScripts?: Array<WritingSystemCode>;
    inputStr?: string;
}> = function ({ onSelect, systemCodes, availableSourceScripts, inputStr }) {
    // Selected transliteration options
    const [systemSpec, updateSystemSpec] = useState<Partial<ScriptConversionSystem>>({});

    const supportedSystems = useMemo(() => systemCodes.map(systemFromCode), [systemCodes]);
    const availableSystems = useMemo(
        () =>
            supportedSystems.filter(
                (ss) =>
                    (!!systemSpec.lang ? ss.lang === systemSpec.lang : true) &&
                    (!!systemSpec.source ? ss.source === systemSpec.source : true) &&
                    (!!systemSpec.target ? ss.target === systemSpec.target : true) &&
                    (!!systemSpec.authority ? ss.authority === systemSpec.authority : true) &&
                    (!!systemSpec.id ? ss.id === systemSpec.id : true)
            ),
        [JSON.stringify(systemSpec), JSON.stringify(supportedSystems)]
    );
    const sourceSystemCodes = useMemo(() => availableSourceScripts?.sort() || [], [
        JSON.stringify(availableSourceScripts),
    ]);

    const langCodes = useMemo(
        () =>
            getSortedUniqueValues(
                supportedSystems.filter((system) => system.source === systemSpec.source),
                "lang"
            ),
        [systemSpec.source, JSON.stringify(supportedSystems)]
    );
    const targetSystemCodes = useMemo(
        () =>
            getSortedUniqueValues(
                supportedSystems.filter(
                    (system) => system.source === systemSpec.source && system.lang === systemSpec.lang
                ),
                "target"
            ),
        [systemSpec.source, systemSpec.lang, JSON.stringify(supportedSystems)]
    );
    const authorityCodes = useMemo(
        () =>
            getSortedUniqueValues(
                supportedSystems.filter(
                    (system) =>
                        system.source === systemSpec.source &&
                        system.lang === systemSpec.lang &&
                        system.target === systemSpec.target
                ),
                "authority"
            ),
        [systemSpec.source, systemSpec.lang, systemSpec.target, JSON.stringify(supportedSystems)]
    );

    const systemIDs = useMemo(
        () =>
            getSortedUniqueValues(
                supportedSystems.filter(
                    (system) =>
                        system.source === systemSpec.source &&
                        system.lang === systemSpec.lang &&
                        system.target === systemSpec.target &&
                        system.authority === systemSpec.authority
                ),
                "id"
            ),
        [systemSpec.source, systemSpec.lang, systemSpec.target, systemSpec.authority, JSON.stringify(supportedSystems)]
    );

    useEffect(() => {
        if (supportedSystems.length > 0) {
            autoSelectAll();
        }
    }, [JSON.stringify(systemSpec), JSON.stringify(supportedSystems)]);

    useEffect(() => {
        if (availableSystems.length === 1) {
            onSelect(availableSystems[0]);
        } else {
            onSelect(null);
        }
    }, [JSON.stringify(availableSystems)]);

    useEffect(() => {
        if (sourceSystemCodes?.length > 0) {
            updateSystemSpec({ source: sourceSystemCodes[0] });
        } else {
            updateSystemSpec({});
        }
    }, [JSON.stringify(sourceSystemCodes)]);

    useEffect(() => {
        if (langCodes.length > 0) {
            updateSystemSpec((spec) => ({ source: spec.source, lang: detectLang() || langCodes[0] }));
        }
    }, [inputStr]);

    function autoSelectAll() {
        if (langCodes.length > 0 && !systemSpec.lang) autoSelectLanguage();
        if (targetSystemCodes.length > 0 && !systemSpec.target) autoSelectTargetScript();
        if (authorityCodes.length > 0 && !systemSpec.authority) autoSelectAuthority();
        if (systemSpec.authority !== undefined && systemIDs.length > 0 && !systemSpec.id) {
            autoSelectId();
        }
    }

    function autoSelectLanguage() {
        updateSystemSpec((spec) => ({ ...spec, lang: detectLang() || langCodes[0] }));
    }

    function detectLang(): string {
        let result: string = undefined;
        if (!!inputStr && inputStr.trim() !== "") {
            result = detectLanguage(inputStr, langCodes);
            console.log("=====AUTO DETECTED LANG: ", langCodes, result);
            if (!result) {
                console.log("==RETRY==", detectAllLanguage(inputStr));
            }
        }
        return result;
    }

    function autoSelectTargetScript() {
        updateSystemSpec((spec) => ({
            ...spec,
            target: getTargetScriptByWeight(targetSystemCodes),
        }));
    }

    function autoSelectAuthority() {
        updateSystemSpec((spec) => ({
            ...spec,
            authority: getLatestSystem(availableSystems)?.authority,
        }));
    }

    function autoSelectId() {
        updateSystemSpec((spec) => ({
            ...spec,
            id: getLatestSystem(availableSystems)?.id,
        }));
    }

    return (
        <SystemPropertySelectorGroup>
            <SystemPropertySelector title="Source writing system" highlighted={!systemSpec.source}>
                <SystemPropertyChoiceList>
                    {sourceSystemCodes.map((sourceSystemCode) => (
                        <Choice
                            name={`source-${sourceSystemCode}`}
                            key={sourceSystemCode}
                            selected={systemSpec.source === sourceSystemCode}
                            onSelect={() =>
                                updateSystemSpec({
                                    source: sourceSystemCode,
                                })
                            }
                        >
                            <WritingSystem code={sourceSystemCode} />
                        </Choice>
                    ))}
                </SystemPropertyChoiceList>
            </SystemPropertySelector>

            <SystemPropertySelector title="Language" highlighted={!systemSpec.lang}>
                <SystemPropertyChoiceList>
                    {langCodes.map((langCode) => (
                        <Choice
                            name={`lang-${langCode}`}
                            key={langCode}
                            selected={systemSpec.lang === langCode}
                            onSelect={() =>
                                updateSystemSpec((spec) => ({
                                    ...spec,
                                    lang: langCode,
                                    target: null,
                                    authority: null,
                                    id: null,
                                }))
                            }
                        >
                            <Lang code={langCode} />
                        </Choice>
                    ))}
                </SystemPropertyChoiceList>
            </SystemPropertySelector>

            <SystemPropertySelector title="Target writing system" highlighted={!systemSpec.target}>
                <SystemPropertyChoiceList>
                    {targetSystemCodes.map((targetSystemCode) => (
                        <Choice
                            name={`target-${targetSystemCode}`}
                            key={targetSystemCode}
                            selected={systemSpec.target === targetSystemCode}
                            onSelect={() =>
                                updateSystemSpec((spec) => ({
                                    ...spec,
                                    target: targetSystemCode,
                                    authority: null,
                                    id: null,
                                }))
                            }
                        >
                            <WritingSystem code={targetSystemCode} />
                        </Choice>
                    ))}
                </SystemPropertyChoiceList>
            </SystemPropertySelector>

            <SystemPropertySelector
                title="Conversion system authority"
                highlighted={systemSpec.source && systemSpec.target && systemSpec.lang && !systemSpec.authority}
            >
                <SystemPropertyChoiceList>
                    {authorityCodes.map((authorityCode) => (
                        <Choice
                            name={`authority-${authorityCode}`}
                            key={authorityCode}
                            selected={systemSpec.authority === authorityCode}
                            onSelect={() =>
                                updateSystemSpec((spec) => ({
                                    ...spec,
                                    authority: authorityCode,
                                    id: null,
                                }))
                            }
                        >
                            {authorityCode}
                        </Choice>
                    ))}
                </SystemPropertyChoiceList>
            </SystemPropertySelector>

            <SystemPropertySelector
                title="Conversion system ID"
                highlighted={systemSpec.authority && !systemSpec.id}
                style={{
                    display: systemSpec.authority || systemSpec.id ? "block" : "none",
                }}
            >
                <SystemPropertyChoiceList>
                    {systemIDs.map((id) => (
                        <Choice
                            name={`id-${id}`}
                            key={id}
                            selected={systemSpec.id === id}
                            onSelect={() => updateSystemSpec((spec) => ({ ...spec, id }))}
                        >
                            {id}
                        </Choice>
                    ))}
                </SystemPropertyChoiceList>
            </SystemPropertySelector>
        </SystemPropertySelectorGroup>
    );
};

const Choice: React.FC<{
    name: string;
    selected: boolean;
    availableStyle?: React.CSSProperties;
    onSelect: () => void;
}> = function ({ selected, name, onSelect, availableStyle, children }) {
    const elID = `system-property-${name}`;

    return (
        <SystemPropertyChoice
            style={{
                fontWeight: selected ? "bold" : "normal",
                ...(availableStyle || {}),
            }}
        >
            <label htmlFor={elID}>
                <SystemPropertyChoiceInput
                    type="radio"
                    name={name}
                    id={elID}
                    checked={selected}
                    onChange={(evt) => (evt.currentTarget.checked ? onSelect() : void 0)}
                />
                {children}
            </label>
        </SystemPropertyChoice>
    );
};

const Lang: React.FC<{ code: string }> = function ({ code }) {
    const lang = getLanguageTitleFrom6392or3(code);

    if (!lang) {
        console.error("Unsupported ISO 639-2 3-letter language code", code);
        return <>{code}</>;
    }

    return <>{lang}</>;
};

const WritingSystem: React.FC<{ code: WritingSystemCode }> = function ({ code }) {
    const system: { Code: string; "English Name": string } | undefined = iso15924_data[code];

    if (!system) {
        console.error("Unsupported ISO 15924 writing system code", code);
        return <>{code}</>;
    }

    return <>{system && system["English Name"]}</>;
};

const SystemPropertySelector: React.FC<{
    title: string;
    style?: React.CSSProperties;
    highlighted?: boolean;
}> = function ({ title, highlighted, children, style }) {
    const sectionStyle: React.CSSProperties = {
        ...style,
        borderColor: highlighted ? `#${primaryColor}` : undefined,
    };
    const headerStyle: React.CSSProperties = {
        color: highlighted ? "white" : undefined,
        background: highlighted ? `#${primaryColor}` : undefined,
    };

    return (
        <SystemPropertySelectorWrapper style={sectionStyle}>
            <h4 style={headerStyle}>{title}</h4>
            {children}
        </SystemPropertySelectorWrapper>
    );
};

const SystemPropertySelectorGroup = styled.div`
    display: flex;
    flex-flow: row wrap;
    align-items: stretch;

    > * {
        margin-right: 0.5rem;
        min-width: 30vw;
        margin-bottom: 0.5rem;
        flex: 1;
    }

    @media screen and (min-width: 900px) {
        flex-flow: row nowrap;
        align-items: flex-start;

        > * {
            min-width: unset;
            margin-bottom: unset;
        }
    }
`;

const SystemPropertySelectorWrapper = styled.section`
    overflow: hidden;
    border-left: 0.25rem solid whiteSmoke;
    padding-left: 0.5rem;

    > h4 {
        font-size: 90%;
        background: whiteSmoke;
        padding: 0.5rem;
        margin-left: -0.5rem;
        margin-top: 0;
        margin-bottom: 0.5rem;
        line-height: 1;
        white-space: nowrap;
        font-weight: normal;

        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const SystemPropertyChoiceList = styled.ul`
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
    list-style: none;
    overflow: hidden;

    margin: 0;

    && {
        padding: 0;
    }
`;

const SystemPropertyChoice = styled.li`
    margin: 0;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;

    > label {
        white-space: nowrap;
        font-size: 90%;
    }
`;

const SystemPropertyChoiceInput = styled.input`
    margin-right: 0.5rem;
    flex-shrink: 0;
`;
