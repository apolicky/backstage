import { useRef, useCallback, useState } from "react";

interface Props {
    onPdfLoaded: (data: ArrayBuffer, name: string) => void;
}

export function HomeView({ onPdfLoaded }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [rejected, setRejected] = useState(false);

    const handleFile = useCallback(
        (file: File) => {
            file.arrayBuffer().then((buf) => onPdfLoaded(buf, file.name));
        },
        [onPdfLoaded],
    );

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file?.type === "application/pdf") {
                handleFile(file);
            } else {
                setRejected(true);
                setTimeout(() => setRejected(false), 1000);
            }
        },
        [handleFile],
    );

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    return (
        <div
            className="h-full bg-black flex items-center justify-center"
            onDragEnter={() => setDragging(true)}
            onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
        >
            <div
                className={`border-2 p-16 flex flex-col items-center gap-6 cursor-pointer select-none
                    ${rejected ? "border-red-500 bg-red-500/10" : dragging ? "border-white bg-white/15" : "border-white hover:bg-white/10"}`}
                onClick={() => inputRef.current?.click()}
            >
                <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeWidth={dragging ? 2.5 : 1.5}
                >
                    <path d="M5 2 h10 l4 4 v16 H5 Z" />
                    <path d="M15 2 v4 h4" />
                </svg>
                <div className="text-center text-gray-400">
                    <p className="text-xl font-bold tracking-widest">
                        {rejected ? "not a PDF" : dragging ? "release to open" : "drop a PDF here"}
                    </p>
                    <p className="mt-2 text-sm tracking-wide">or click to browse</p>
                </div>
                <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={onChange} />
            </div>
        </div>
    );
}
