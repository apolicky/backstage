import { useState } from "react";
import { HomeView } from "./views/HomeView";
import { LandingView } from "./views/LandingView";
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

    if (presenting && doc && pdfData) {
        return <PresenterView doc={doc} pdfData={pdfData} fileName={fileName} />;
    }

    if (doc && pdfData) {
        return (
            <div className="h-full bg-black flex items-center justify-center">
                <div className="text-center text-white border-2 border-white p-12">
                    <p className="text-lg font-bold tracking-widest">{fileName}</p>
                    <p className="text-gray-400 mt-2 text-sm">{doc.numPages} slides</p>
                    <button
                        onClick={() => setPresenting(true)}
                        className="mt-8 px-8 py-3 bg-white text-black text-base font-bold tracking-widest hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        start presenting
                    </button>
                    <button
                        onClick={() => {
                            setPdfData(null);
                            setFileName("");
                        }}
                        className="mt-4 block mx-auto text-sm text-gray-500 hover:text-white transition-colors tracking-wide cursor-pointer"
                    >
                        choose a different file
                    </button>
                </div>
            </div>
        );
    }

    if (!started) return <LandingView onStart={() => setStarted(true)} />;

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
