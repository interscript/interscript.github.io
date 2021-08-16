import React, { useState, useCallback } from "react";
import axios, { AxiosPromise } from "axios";

const API_URI = "https://staging-api.interscript.org/staging";

interface SystemRelevance {
    distance: number;
    mapName: string;
}

export default () => {
    const [source, setSource] = useState<string>("");
    const [target, setTarget] = useState<string>("");
    const [result, setResult] = useState<SystemRelevance[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const detectAPI = useCallback(
        (input: String, output: String): AxiosPromise<any> => {
            return axios.post(
                API_URI,
                `{
                  detect(input: "${input}", output: "${output}") {
                    distance,
                    mapName
                  }
                }`
            );
        },
        [source, target]
    );

    const detect = async () => {
        clear();
        if (source && target) {
            setLoading(true);
            try {
                const resp = await detectAPI(source, target);
                if (resp.data?.data?.detect) {
                    setResult(resp.data["data"]["detect"]);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const clear = () => {
        setResult([]);
    };

    const list = result
        .sort((a, b) => a.distance - b.distance)
        .map((s: SystemRelevance, i) => (
            <li key={i}>
                {s.mapName} --
                <span>{s.distance}</span>
            </li>
        ));

    return (
        <div>
            <h1> Detect Transliteration System</h1>
            <form>
                Input : <input type="text" onChange={(e) => setSource(e.target.value)} />
                Output : <input type="text" onChange={(e) => setTarget(e.target.value)} />
                <input type="button" value="Detect" onClick={detect} disabled={loading} />
                <ul>
                    {error && <li>{error}</li>}
                    {list}
                </ul>
            </form>
        </div>
    );
};
