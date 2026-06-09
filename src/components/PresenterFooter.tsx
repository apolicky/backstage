interface Props {
    page: number;
    pageCount: number;
    onPrev: () => void;
    onNext: () => void;
}

export function PresenterFooter({ page, pageCount, onPrev, onNext }: Props) {
    return (
        <div className="h-12 bg-black border-t border-white flex items-center justify-center gap-4 shrink-0">
            <button
                onClick={onPrev}
                disabled={page === 0}
                className="px-6 py-2 border border-white text-white text-sm hover:bg-white hover:text-black disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
                ⬅️ prev
            </button>
            <button
                onClick={onNext}
                disabled={page >= pageCount - 1}
                className="px-6 py-2 border border-white text-white text-sm hover:bg-white hover:text-black disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
                next ➡️
            </button>
        </div>
    );
}
