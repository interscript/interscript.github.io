import React, { useState, useCallback } from "react";
import { Link } from "@reach/router";
import axios, { AxiosPromise } from "axios";
import styled from "styled-components";
import { primaryColor } from "../App";

const API_URI = "https://api.interscript.org/prod";
// const API_URI = "https://staging-api.interscript.org/staging";

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
        if (loading) return "Processing...";

        if (!!error) return error;

        return result || "";
    };

    return (
        <div>
            <h1> Rababa for Arabic diacriticization </h1>
            <div>
            <p>
              <a href="https://en.wikipedia.org/wiki/Arabic_diacritics">
                Diacritization
              </a> {" "}
              is the art of completing Arabic scripts with the
              correct vocalization, which is a task that only advanced Arabic
              speakers successfully manage.
            </p>
            <p>
              <a href="https://github.com/interscript/rababa">Rababa</a> is an
              open source, openly-licensed library available on both Python and
              Ruby that utilizes advanced neural network architectures for the
              diacriticization of {" "}
              <a href="https://en.wikipedia.org/wiki/Abjad">
                Abjad scripts
              </a> {" "}
              like Arabic and Hebrew.
              Moreover, the trained models are also openly-licensed and their
              source datasets are also open sourced.
            </p>
            <p>
              <a href="https://github.com/secryst/rababa-models">
                Trained Rababa models
              </a> {" "}
              are available in both PyTorch and ONNX formats, which allows for
              platform-independent execution of the library.
            </p>
            <p>
              More details about the development and origin of Rababa can be
              found on our {" "}
              <Link to={`/blog/diacritization_in_arabic_with_deep_learning`}>
                Rababa blog post
              </Link>. {" "}
              <a href="https://github.com/interscript/rababa">Rababa</a> is
              available on GitHub.
            </p>
            <p>
              Enter unpointed Arabic text (or update the sample) and click
              "Add diacritics" to obtain diacriticized Arabic.
            </p>
            </div>
            <SampleAndResult>
                <SampleTextArea
                  defaultValue={"علامة التشكيل"}
                  placeholder={"علامة التشكيل"}
                  style={{
                      boxShadow: source.trim() === "" ? `#${primaryColor} 0 0 0px .5rem` : undefined,
                  }}
                />
                <ConvertButton onClick={transliterate} value="Add diacritics" disabled={loading || source.trim() === ""}>
                  Add diacritics
                </ConvertButton>
                <ResultTextArea disabled value={getResultText()} />
            </SampleAndResult>
            <p></p>
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
