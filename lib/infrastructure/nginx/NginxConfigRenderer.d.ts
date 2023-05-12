import { Context } from "../../models";
import { NginxServer } from "./NginxConfig";
export declare class NginxConfigRenderer {
    renderServer(context: Context, server: NginxServer, external: boolean, domain: string): string;
    private renderExternalRedirects;
    private renderLocation;
    private renderFastCgiPhpLocation;
    private renderService;
    private renderHtmlService;
    private renderPhpService;
    private renderProxyService;
}
