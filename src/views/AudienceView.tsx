import { useState, useEffect } from "react";
import { usePdf } from "../hooks/usePdf";
import { useChannel } from "../hooks/useChannel";
import { SlideCanvas } from "../components/SlideCanvas";
import type { ChannelMessage } from "../lib/types";

export function AudienceView() {
    const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
    const [page, setPage] = useState(0);
    const [connected, setConnected] = useState(false);
    const [slideAspect, setSlideAspect] = useState<number | null>(null);
    const [wrapperSize, setWrapperSize] = useState<{ w: number; h: number } | null>(null);
    const doc = usePdf(pdfData);

    useEffect(() => {
        if (!doc) {
            setSlideAspect(null);
            return;
        }
        doc.getPage(1)
            .then((p) => {
                const vp = p.getViewport({ scale: 1 });
                setSlideAspect(vp.width / 2 / vp.height);
            })
            .catch(console.error);
    }, [doc]);

    useEffect(() => {
        if (!slideAspect) return;
        const update = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            setWrapperSize(w / h > slideAspect ? { w: h * slideAspect, h } : { w, h: w / slideAspect });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [slideAspect]);

    const { send } = useChannel((msg: ChannelMessage) => {
        if (msg.type === "init") {
            setPdfData(msg.pdfData);
            setPage(msg.currentPage);
            setConnected(true);
        } else if (msg.type === "goto") {
            setPage(msg.page);
        }
    });

    useEffect(() => {
        if (connected) return;
        send({ type: "request-init" });
        const id = setInterval(() => send({ type: "request-init" }), 1000);
        return () => clearInterval(id);
    }, [connected, send]);

    if (!connected || !doc) {
        return (
            <div className="h-full bg-black flex items-center justify-center">
                <p className="text-gray-600 text-lg">Waiting for presenter…</p>
            </div>
        );
    }

    return (
        <div className="h-full bg-black flex items-center justify-center">
            <div
                style={
                    wrapperSize ? { width: wrapperSize.w, height: wrapperSize.h } : { width: "100%", height: "100%" }
                }
            >
                <SlideCanvas doc={doc} pageIndex={page} side="left" className="w-full h-full" />
            </div>
        </div>
    );
}
