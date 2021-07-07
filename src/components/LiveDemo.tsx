import axios, { AxiosResponse } from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useRouteData } from "react-static";
import styled from "styled-components";
import { primaryColor } from "../App";
import { ScriptConversionSystem, systemToCode } from "../scs";
import { getLanguageTitleFrom6392BorT } from "./isoLang";
import { SystemSelector } from "./SystemSelector";

const API_ENDPOINT = "https://api.interscript.org"; //for issue https://github.com/interscript/infrastructure/issues/17

export default () => {
    const { mapsInfo }: { mapsInfo: any } = useRouteData();
    const [sampleText, setSampleText] = useState<string>("");
    const [selectedSystem, selectSystem] = useState<ScriptConversionSystem | null>(null);
    const [result, setResult] = useState<string | null | undefined>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const sampleInputRef = useRef<HTMLTextAreaElement>(null);

    const systemCode: string | null = selectedSystem !== null ? systemToCode(selectedSystem) : null;

    useEffect(() => {
        setError(null);
        setSubmitted(false);
    }, [systemCode, sampleText]);

    useEffect(() => {
        if (systemCode) {
            sampleInputRef.current?.focus();
        }
    }, [systemCode]);

    async function handleConvert() {
        if (systemCode !== null && sampleText.trim() !== "") {
            let resp: AxiosResponse<any>;

            setError(null);
            setResult(undefined);
            setSubmitted(true);

            try {
                resp = await axios({
                    method: "POST",
                    url: API_ENDPOINT,
                    data: `{transliterate(systemCode: \"${systemCode}\", input: \"${sampleText}\")}`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } catch (e) {
                setResult(null);
                setSubmitted(false);
                setError("Sorry, an error occurred :(");
            }
            setResult(resp.data?.data?.transliterate || "No result returned, please check your sample!");
        }
    }

    let placeholder: string;
    if (selectedSystem?.lang) {
        placeholder = `Enter something in ${
            getLanguageTitleFrom6392BorT(selectedSystem.lang) || "selected writing system"
        }…`;
    } else {
        placeholder = "Enter something…";
    }

    return (
        <>
            <SystemSelector onSelect={selectSystem} systemCodes={mapsInfo.data} />

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

            {systemCode !== null ? (
                <p>
                    <small>
                        Selected script conversion system code:&emsp;
                        <code>{systemCode}</code>
                    </small>
                </p>
            ) : null}
        {/* test */}
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
