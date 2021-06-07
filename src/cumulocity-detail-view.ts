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
    // public addColor() {
    //     if (this._view) {
    //         this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
    //         this._view.webview.postMessage({ type: "addColor" });
    //     }
    // }

    // public clearColors() {
    //     if (this._view) {
    //         this._view.webview.postMessage({ type: "clearColors" });
    //     }
    // }

    private _getHtmlForWebview(webview: Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "main.js"));

        // Do the same for the stylesheet.
        const styleResetUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "reset.css"));
        const styleVSCodeUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "css"));
        const styleMainUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "media", "main.css"));

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
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				-->
				<link href="${styleMainUri}" rel="stylesheet">

				<title>Cat Colors</title>
			</head>
			<body>

                <div id="data">
                    <h2>Managed Object</h2>
                    <div class="flex-grid">
                        <div id="heading" class="col">
                        </div>
                        <div id="fielddata" class="col">
                        </div>
                    </div>
                </div>
                <pre id="json"></pre>
                <script>
                    fields = [
                        "name",
                        "type",
                        "id",
                        "owner",
                        "lastUpdated",
                        "c8y_IsDeviceGroup",
                        "childDevices",
                        "childAssets",
                        "childAdditions"
                    ];


                    function createHeading(s) {
                        return [
                            '<p><b>',
                            s,
                            '</p></b>'
                        ].join('');
                    }

                    function createFieldData(s) {
                        //<p id="type"></p>
                        return [
                            '<p id=\"',
                            s,
                            '\">',
                            '</p>'
                        ].join('');
                    }

                    function populateFromObject(message = testObj) {
                        console.log(JSON.stringify(message, null, 2));
                        const h = document.getElementById('heading');
                        const fd = document.getElementById('fielddata');

                        h.innerHTML = ""
                        fd.innerHTML = ""
                        fields.forEach((f) => {
                            h.innerHTML = h.innerHTML + createHeading(f);
                            fd.innerHTML = fd.innerHTML + createFieldData(f);
                        });



                        fields.forEach((f) => {
                            console.log("FIELD ", f)
                            const element = document.getElementById(f);
                            if (element) {
                                element.textContent = (f in message) ? message[f] : "undefined";
                                console.log("FIELD ", f, (f in message), (f in message) ? message[f] : "undefined")
                            } else {
                                console.log("MISSING", f)
                            }

                        });
                    };

                    window.addEventListener('message', event => {
                        const message = event.data[0].managedObject; // The JSON data our extension sent
                        const h = document.getElementById('heading');
                        const fd = document.getElementById('fielddata');

                        h.innerHTML = ""
                        fd.innerHTML = ""
                        fields.forEach((f) => {
                            h.innerHTML = h.innerHTML + createHeading(f);
                            fd.innerHTML = fd.innerHTML + createFieldData(f);
                        });



                        fields.forEach((f) => {
                            console.log("FIELD ", f)
                            const element = document.getElementById(f);
                            if (element) {
                                element.textContent = (f in message) ? message[f] : "undefined";
                                console.log("FIELD ", f, (f in message), (f in message) ? message[f] : "undefined")
                            } else {
                                console.log("MISSING", f)
                            }

                        });
                    });


                </script>
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
