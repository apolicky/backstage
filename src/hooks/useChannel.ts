import { useCallback, useEffect, useRef } from "react";
import type { ChannelMessage } from "../lib/types";

const CHANNEL = "slide-sync";

export function useChannel(onMessage: (msg: ChannelMessage) => void) {
    const channelRef = useRef<BroadcastChannel | null>(null);
    const onMessageRef = useRef(onMessage);
    onMessageRef.current = onMessage;

    useEffect(() => {
        const ch = new BroadcastChannel(CHANNEL);
        channelRef.current = ch;
        ch.onmessage = (e: MessageEvent<ChannelMessage>) => onMessageRef.current(e.data);
        return () => {
            ch.close();
            channelRef.current = null;
        };
    }, []);

    const send = useCallback((msg: ChannelMessage) => channelRef.current?.postMessage(msg), []);
    return { send };
}
