import { useState } from "react";
import { HomeView } from "./views/HomeView";
import { LandingView } from "./views/LandingView";
import { ConfirmView } from "./views/ConfirmView";
import { PresenterView } from "./views/PresenterView";
import { AudienceView } from "./views/AudienceView";
import { usePdf } from "./hooks/usePdf";

function App() {
    const [started, setStarted] = useState(false);
    const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
    const [fileName, setFileName] = useState("");
    const [presenting, setPresenting] = useState(false);
    const doc = usePdf(pdfData);

    const viewParam = new URLSearchParams(window.location.search).get("view");
    if (viewParam === "audience") return <AudienceView />;
    if (!started) return <LandingView onStart={() => setStarted(true)} />;
    if (presenting && doc && pdfData) return <PresenterView doc={doc} pdfData={pdfData} fileName={fileName} />;
    if (doc && pdfData)
        return (
            <ConfirmView
                fileName={fileName}
                pageCount={doc.numPages}
                onStart={() => setPresenting(true)}
                onReset={() => {
                    setPdfData(null);
                    setFileName("");
                }}
            />
        );
    return (
        <HomeView
            onPdfLoaded={(data, name) => {
                setPdfData(data);
                setFileName(name);
            }}
        />
    );
}

export default App;
