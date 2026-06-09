export type ChannelMessage =
    | { type: "request-init" }
    | { type: "init"; pdfData: ArrayBuffer; currentPage: number }
    | { type: "goto"; page: number };
