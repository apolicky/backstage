import { useState, useEffect } from "react";

interface Props {
    startTime: number;
    onReset: () => void;
    className?: string;
}

export function Timer({ startTime, onReset, className }: Props) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const elapsed = now - startTime;
    const h = Math.floor(elapsed / 3_600_000);
    const m = Math.floor((elapsed % 3_600_000) / 60_000);
    const s = Math.floor((elapsed % 60_000) / 1_000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const elapsedLabel = h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;

    const d = new Date(now);
    const clockLabel = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

    return (
        <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
            <span>⏱️{elapsedLabel}</span>
            <button
                onClick={onReset}
                className="px-2 py-0.5 border border-white text-white hover:bg-white hover:text-black text-xs transition-colors"
                title="Reset timer"
            >
                ↺
            </button>
            <span className="text-gray-500">🕰️{clockLabel}</span>
        </span>
    );
}
