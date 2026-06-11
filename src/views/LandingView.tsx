interface Props {
    onStart: () => void;
}

export function LandingView({ onStart }: Props) {
    return (
        <div className="h-full bg-black flex flex-col items-center justify-center px-8">
            <div className="max-w-lg w-full">
                <h1 className="text-5xl font-bold tracking-widest text-white font-mono">backstage_</h1>
                <p className="mt-3 text-gray-400 tracking-widest text-sm">The view your audience never sees.</p>
                <p className="mt-8 text-gray-300 leading-relaxed">
                    A browser-based presenter for Beamer PDFs. Drop your PDF and open an audience window — the two stay
                    in sync automatically. No server, no account, nothing to install.
                </p>
                <button
                    onClick={onStart}
                    className="mt-10 px-8 py-3 bg-white text-black text-base font-bold tracking-widest hover:bg-gray-200 transition-colors cursor-pointer"
                >
                    open a presentation
                </button>
                <p className="mt-8 text-xs text-gray-600 tracking-wide">
                    Works in Chrome, Firefox, Edge · Desktop only · by{" "}
                    <a
                        href="https://apolicky.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-400"
                    >
                        apolicky.xyz
                    </a>
                </p>
            </div>
        </div>
    );
}
