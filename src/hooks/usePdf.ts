import { useState, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export function usePdf(data: ArrayBuffer | null): PDFDocumentProxy | null {
    const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);

    useEffect(() => {
        if (!data) {
            setDoc(null);
            return;
        }
        const task = pdfjs.getDocument({ data: data.slice(0) });
        task.promise.then(setDoc).catch(console.error);
        return () => {
            task.destroy();
            setDoc(null);
        };
    }, [data]);

    return doc;
}
