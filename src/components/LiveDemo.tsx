import axios, { AxiosResponse } from "axios";
import Interscript from "interscript";
import React, { useEffect, useRef, useState } from "react";
import { InterscriptMetaDataMap } from "../meta";
import { ScriptConversionSystem, systemToCode } from "../scs";
import { getLanguageTitleFrom6392or3 } from "components/isoLang";
import { SystemSelector } from "./SystemSelector";
import { primaryColor } from "../App";
import styled from "styled-components";

const API_ENDPOINT = "https://api.interscript.org/prod"; //for issue https://github.com/interscript/infrastructure/issues/17
// const API_ENDPOINT = "https://staging-api.interscript.org/staging";

export type DemoType = "RUBY" | "JAVASCRIPT";
const ARABIC_LANG = "ara";

export const LiveDemo: React.FC<{ maps: string[]; metaData: InterscriptMetaDataMap; demoType?: DemoType }> = function ({
    maps,
    metaData,
    demoType = "JAVASCRIPT",
}) {
    const [sampleText, setSampleText] = useState<string>("");
    const [selectedSystem, selectSystem] = useState<ScriptConversionSystem | null>(null);
    const [result, setResult] = useState<string | null | undefined>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [reverse, setReverse] = useState<boolean>(false);
    const [diacriticize, setDiacriticize] = useState<boolean>(false);

    const sampleInputRef = useRef<HTMLTextAreaElement>(null);

    const systemCode: string | null = selectedSystem !== null ? systemToCode(selectedSystem) : null;
    const api: boolean = demoType === "RUBY";

    console.log(demoType);

    useEffect(() => {
        setError(null);
        setSubmitted(false);
    }, [systemCode, sampleText]);

    useEffect(() => {
        if (systemCode) {
            sampleInputRef.current?.focus();
        }

        let test: string | null;
        if (systemCode !== null) {
            test = getTestExample(systemCode);
            if (test !== null) {
                setSampleText(test);
            }
        }
    }, [systemCode, reverse]);

    useEffect(() => {
        (async () => {
            try {
                // await Interscript.load_map_list();
                // setSystemCodes(maps);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    function getTestExample(system: string): string | null {
        return metaData[system].test && metaData[system].test[+reverse];
    }

    function reverseName(name: string): string {
        let newname: string[] = (name || "noname").split("-");
        if (newname.length >= 4) {
            const tmp: string = newname[3];
            newname[3] = newname[2];
            newname[2] = tmp;
        }
        let newnameStr: string = newname.join("-");
        if (newnameStr === name) {
            newnameStr = newnameStr.replace("-reverse", "");
        }
        if (newnameStr === name) {
            newnameStr = newnameStr + "-reverse";
        }
        return newnameStr;
    }

    const isArabic = selectedSystem?.lang === ARABIC_LANG;
    const diacriticizable = isArabic && api;

    async function handleConvert() {
        if (systemCode !== null && sampleText.trim() !== "") {
            setError(null);
            setResult(undefined);
            setSubmitted(true);

            let respApi: AxiosResponse<any>;
            let resp: string;
            try {
                let systemName = reverse ? reverseName(systemCode) : systemCode;
                if (diacriticize && diacriticizable) {
                    systemName = !reverse
                        ? `var-ara-Arab-Arab-rababa|${systemName}`
                        : `${systemName}|var-ara-Arab-Arab-rababa-reverse`;
                }

                if (api) {
                    respApi = await axios({
                        method: "POST",
                        url: API_ENDPOINT,
                        data: `{transliterate(systemCode: \"${systemName}\", input: \"${sampleText}\")}`,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                } else {
                    Interscript.map_path = "/maps/";
                    await Interscript.load_map(systemName);
                    resp = Interscript.transliterate(systemName, sampleText);
                }
            } catch (e) {
                setResult(null);
                setSubmitted(false);
                setError("Sorry, an error occurred :(");
            }
            setResult(
                (api ? respApi?.data?.data?.transliterate : resp) || "No result returned, please check your sample!"
            );
        }
    }

    let placeholder: string;
    if (selectedSystem?.lang) {
        placeholder = `Enter something in ${
            getLanguageTitleFrom6392or3(selectedSystem.lang) || "selected writing system"
        }…`;
    } else {
        placeholder = "Enter something…";
    }

    return (
        <>
            <SystemSelector onSelect={selectSystem} systemCodes={maps} />
            <SampleAndResult>
                <SampleTextArea
                    ref={sampleInputRef}
                    value={sampleText}
                    placeholder={placeholder}
                    style={{
                        boxShadow:
                            sampleText.trim() === "" && systemCode !== null
                                ? `#${primaryColor} 0 0 0px .5rem`
                                : undefined,
                    }}
                    onChange={(evt) => setSampleText(evt.currentTarget.value)}
                />
                <ConvertButton
                    onClick={handleConvert}
                    disabled={submitted === true || systemCode === null || sampleText.trim() === ""}
                >
                    Convert &rarr;
                </ConvertButton>
                <ResultTextArea
                    placeholder={selectedSystem === null ? "Select a system above" : undefined}
                    disabled
                    value={result === undefined ? "Loading…" : result || error || ""}
                />
            </SampleAndResult>
            <input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} />
            Reverse
            {diacriticizable && (
                <div>
                    <input type="checkbox" checked={diacriticize} onChange={(e) => setDiacriticize(e.target.checked)} />
                    Diacriticize Arabic
                </div>
            )}
            {systemCode !== null ? (
                <p>
                    <small>
                        Selected script conversion system code:&emsp;
                        <code>{systemCode}</code>
                    </small>
                </p>
            ) : null}
            <p style={{ height: "10rem" }}></p>
        </>
    );
};

const ConvertButton = styled.button`
    flex-shrink: 0;
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    border: 0;
    font-size: 100%;

    color: ${(props) => (props.disabled ? "silver" : `white`)};

    background: ${(props) => (props.disabled ? "whiteSmoke" : `#${primaryColor}`)};
`;

const SampleAndResult = styled.div`
    margin-top: 1rem;

    > :first-child,
    > :last-child {
        width: 100%;
    }

    @media screen and (min-width: 900px) {
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;

        > :first-child,
        > :last-child {
            flex: 1;
            width: unset;
        }
    }
`;

const SampleTextArea = styled.textarea`
    font-size: 100%;
    padding: 0.5rem;
    margin: 0;
    background: whiteSmoke;
    border: 0;
    z-index: 2;
    display: block;
`;

const ResultTextArea = styled(SampleTextArea)`
    cursor: default;
`;

export default LiveDemo;
