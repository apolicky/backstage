import type { PDFDocumentProxy } from "pdfjs-dist";
import { SlideCanvas } from "./SlideCanvas";

interface Props {
    doc: PDFDocumentProxy;
    page: number;
    hasNext: boolean;
    splitPct: number;
}

export function SlidePreview({ doc, page, hasNext, splitPct }: Props) {
    return (
        <div className="flex flex-1 overflow-hidden p-2 gap-2 min-h-0">
            <div className="flex flex-col gap-2 min-h-0 shrink-0" style={{ width: `${splitPct}%` }}>
                <SlideCanvas
                    doc={doc}
                    pageIndex={page}
                    side="left"
                    className={`bg-black ${hasNext ? "flex-[3]" : "flex-1"}`}
                />
                {hasNext && (
                    <div className="flex flex-col flex-[2] min-h-0">
                        <div className="text-xs text-gray-500 mb-1 px-1 tracking-widest">next</div>
                        <SlideCanvas
                            doc={doc}
                            pageIndex={page + 1}
                            side="left"
                            className="flex-1 bg-black opacity-50"
                        />
                    </div>
                )}
            </div>
            <SlideCanvas doc={doc} pageIndex={page} side="right" className="flex-1 bg-black" />
        </div>
    );
}
