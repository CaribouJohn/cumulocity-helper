/** @format */

import { CancellationToken, SnippetString, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext, window } from "vscode";

export class CumulocityViewProvider implements WebviewViewProvider {
    public static readonly viewType = "cumulocity-view-detail";

    private _view?: WebviewView;

    constructor(private readonly _extensionUri: Uri) { }

    public resolveWebviewView(webviewView: WebviewView, context: WebviewViewResolveContext, _token: CancellationToken) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case "colorSelected": {
                    window.activeTextEditor?.insertSnippet(new SnippetString(`#${data.value}`));
                    break;
                }
            }
        });
    }

    postMessage(msg: any) {
        if (this._view) {
            this._view.webview.postMessage(msg);
            console.log("posted message", msg);
        } else {
            console.log("failed to post message", msg);
        }
    }

    private _getHtmlForWebview(webview: Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "main.js"));

        // Do the same for the stylesheet.
        const styleResetUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "reset.css"));
        const styleVSCodeUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "vscode.css"));
        const styleMainUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "main.css"));
        const lodash = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "node_modules", "lodash", "lodash.js"));//'node_modules\lodash\lodash.js'

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				-->
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
                <script src="${lodash}"></script>
				<title>Managed Object Webview</title>
			</head>
			<body>

                <div id="data">
                    <h2>Managed Object</h2>
                    <div id="moGrid" class="grid-container">
                    </div>
                </div>
                <div id="test"></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
