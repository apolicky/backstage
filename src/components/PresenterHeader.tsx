import { Timer } from "./Timer";

interface Props {
    fileName: string;
    page: number;
    pageCount: number;
    startTime: number;
    onResetTimer: () => void;
    splitLabel: string;
    onCycleSplit: () => void;
    onOpenAudience: () => void;
}

export function PresenterHeader({
    fileName,
    page,
    pageCount,
    startTime,
    onResetTimer,
    splitLabel,
    onCycleSplit,
    onOpenAudience,
}: Props) {
    return (
        <div className="h-10 bg-black border-b border-white flex items-center px-4 gap-3 text-sm text-gray-300 shrink-0">
            <span className="truncate max-w-xs font-bold tracking-wide text-xs">{fileName}</span>
            <span title="Reload the page to start a new presentation" className="cursor-default select-none">🔄</span>
            <span className="ml-auto font-mono">
                <Timer startTime={startTime} onReset={onResetTimer} />
            </span>
            <span className="text-gray-400 tabular-nums">
                slide: {page + 1} / {pageCount}
            </span>
            <button
                onClick={onCycleSplit}
                className="px-3 py-1 border border-white text-white text-xs hover:bg-white hover:text-black transition-colors tabular-nums"
                title="Cycle slide panel width"
            >
                {splitLabel}
            </button>
            <button
                onClick={onOpenAudience}
                className="px-3 py-1 bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors"
            >
                open audience view
            </button>
        </div>
    );
}
