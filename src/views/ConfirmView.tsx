interface Props {
    fileName: string;
    pageCount: number;
    onStart: () => void;
    onReset: () => void;
}

export function ConfirmView({ fileName, pageCount, onStart, onReset }: Props) {
    return (
        <div className="h-full bg-black flex items-center justify-center">
            <div className="text-center text-white border-2 border-white p-12">
                <p className="text-lg font-bold tracking-widest">{fileName}</p>
                <p className="text-gray-400 mt-2 text-sm">{pageCount} slides</p>
                <button
                    onClick={onStart}
                    className="mt-8 px-8 py-3 bg-white text-black text-base font-bold tracking-widest hover:bg-gray-200 transition-colors cursor-pointer"
                >
                    start presenting
                </button>
                <button
                    onClick={onReset}
                    className="mt-4 block mx-auto text-sm text-gray-500 hover:text-white transition-colors tracking-wide cursor-pointer"
                >
                    choose a different file
                </button>
            </div>
        </div>
    );
}
