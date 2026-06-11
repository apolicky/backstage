import { useState, useEffect, useCallback, useRef } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { PresenterHeader } from "../components/PresenterHeader";
import { SlidePreview } from "../components/SlidePreview";
import { PresenterFooter } from "../components/PresenterFooter";
import { useChannel } from "../hooks/useChannel";
import type { ChannelMessage } from "../lib/types";

interface Props {
    doc: PDFDocumentProxy;
    pdfData: ArrayBuffer;
    fileName: string;
}

const SPLITS = [
    { label: "1/4", value: 25 },
    { label: "1/3", value: 33 },
    { label: "2/5", value: 40 },
];

export function PresenterView({ doc, pdfData, fileName }: Props) {
    const [page, setPage] = useState(0);
    const [splitIdx, setSplitIdx] = useState(2);
    const [startTime, setStartTime] = useState(() => Date.now());
    const pageCount = doc.numPages;
    const pageRef = useRef(0);
    const pdfDataRef = useRef(pdfData);
    pdfDataRef.current = pdfData;

    const { send } = useChannel((msg: ChannelMessage) => {
        if (msg.type === "request-init") {
            send({ type: "init", pdfData: pdfDataRef.current.slice(0), currentPage: pageRef.current });
        }
    });

    const goTo = useCallback(
        (n: number) => {
            const p = Math.max(0, Math.min(n, pageCount - 1));
            pageRef.current = p;
            setPage(p);
            send({ type: "goto", page: p });
        },
        [pageCount, send],
    );

    const next = useCallback(() => goTo(pageRef.current + 1), [goTo]);
    const prev = useCallback(() => goTo(pageRef.current - 1), [goTo]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
                e.preventDefault();
                next();
            } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
                e.preventDefault();
                prev();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [next, prev]);

    return (
        <div className="h-full bg-black flex flex-col text-white">
            <PresenterHeader
                fileName={fileName}
                page={page}
                pageCount={pageCount}
                startTime={startTime}
                onResetTimer={() => setStartTime(Date.now())}
                splitLabel={SPLITS[splitIdx].label}
                onCycleSplit={() => setSplitIdx((i) => (i + 1) % SPLITS.length)}
                onOpenAudience={() => window.open("/?view=audience", "audience-window", "popup,width=1280,height=720")}
            />
            <SlidePreview doc={doc} page={page} hasNext={page < pageCount - 1} splitPct={SPLITS[splitIdx].value} />
            <PresenterFooter canPrev={page > 0} canNext={page < pageCount - 1} onPrev={prev} onNext={next} />
        </div>
    );
}
