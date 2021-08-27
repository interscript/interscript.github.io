import React, { useState, useCallback } from "react";
import axios, { AxiosPromise } from "axios";
import styled from "styled-components";
import { primaryColor } from "../App";

const API_URI = "https://api.interscript.org";

export default () => {
    const [source, setSource] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const rababaAPI = useCallback(
        (input: String): AxiosPromise<any> => {
            return axios.post(
                API_URI,
                `{
                    transliterate(systemCode: "var-ara-Arab-Arab-rababa", input: "${input}")
                }`
            );
        },
        [source]
    );

    const transliterate = async () => {
        clear();
        if (source) {
            setLoading(true);
            try {
                const resp = await rababaAPI(source);
                if (resp.data?.data?.transliterate) {
                    setResult(resp.data["data"]["transliterate"]);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const clear = () => {
        setResult("");
    };

    const getResultText = () => {
        if (loading) return "Loading...";

        if (!!error) return error;

        return result || "";
    };

    return (
        <div>
            <h1> Rababa Test </h1>
            <SampleAndResult>
                <SampleTextArea
                    placeholder={"Input source text"}
                    style={{
                        boxShadow: source.trim() === "" ? `#${primaryColor} 0 0 0px .5rem` : undefined,
                    }}
                    onChange={(evt) => setSource(evt.currentTarget.value)}
                />
                <ConvertButton onClick={transliterate} value="Convert" disabled={loading || source.trim() === ""}>
                    Convert
                </ConvertButton>
                <ResultTextArea disabled value={getResultText()} />
            </SampleAndResult>
        </div>
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
