export type NginxHtmlService = {
    readonly type: "html";
};
export type NginxPhpService = {
    readonly type: "php";
    readonly options: {
        readonly version: string;
    };
};
export type NginxProxyService = {
    readonly type: "proxy";
    readonly options: {
        readonly pass: string;
    };
};
export type NginxService = NginxHtmlService | NginxPhpService | NginxProxyService;
export type NginxLocation = {
    readonly path: string;
    readonly basicAuth?: boolean;
    readonly service: NginxService;
};
export type NginxServer = {
    readonly locations: Array<NginxLocation>;
};
export interface NginxConfig {
    readonly external?: NginxServer;
    readonly internal?: NginxServer;
}
