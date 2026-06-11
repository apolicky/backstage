import { useEffect, useRef, useCallback } from "react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

type RenderTask = ReturnType<PDFPageProxy["render"]>;

interface Props {
    doc: PDFDocumentProxy;
    pageIndex: number;
    side: "left" | "right";
    className?: string;
}

export function SlideCanvas({ doc, pageIndex, side, className }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderTaskRef = useRef<RenderTask | null>(null);

    const render = useCallback(async () => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;

        renderTaskRef.current?.cancel();
        renderTaskRef.current = null;

        const page = await doc.getPage(pageIndex + 1);
        const naturalVP = page.getViewport({ scale: 1 });
        const halfW = naturalVP.width / 2;
        const halfH = naturalVP.height;

        const dpr = window.devicePixelRatio || 1;
        const scale = Math.min(w / halfW, h / halfH);
        const renderScale = Math.max(scale * dpr, 2);

        // Render the full double-wide page into an offscreen canvas, then copy
        // only the relevant half into the visible canvas.
        const offscreen = document.createElement("canvas");
        offscreen.width = Math.round(naturalVP.width * renderScale);
        offscreen.height = Math.round(halfH * renderScale);
        const offCtx = offscreen.getContext("2d")!;

        const viewport = page.getViewport({ scale: renderScale });
        const task = page.render({ canvas: offscreen, canvasContext: offCtx, viewport });
        renderTaskRef.current = task;
        try {
            await task.promise;
        } catch {
            renderTaskRef.current = null;
            return; // render cancelled
        }
        renderTaskRef.current = null;

        const halfPx = Math.round(halfW * renderScale);
        canvas.width = halfPx;
        canvas.height = offscreen.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(
            offscreen,
            side === "right" ? halfPx : 0,
            0,
            halfPx,
            offscreen.height,
            0,
            0,
            halfPx,
            offscreen.height,
        );

        canvas.style.width = `${Math.round(halfW * scale)}px`;
        canvas.style.height = `${Math.round(halfH * scale)}px`;
    }, [doc, pageIndex, side]);

    useEffect(() => {
        render();
        return () => { renderTaskRef.current?.cancel(); };
    }, [render]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const ro = new ResizeObserver(render);
        ro.observe(container);
        return () => ro.disconnect();
    }, [render]);

    return (
        <div ref={containerRef} className={className} style={{ position: "relative" }}>
            <canvas
                ref={canvasRef}
                style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            />
        </div>
    );
}
