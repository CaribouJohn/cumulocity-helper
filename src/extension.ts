/** @format */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CumulocityView } from "./cumulocity-view";
import { CumulocityViewProvider } from "./cumulocity-detail-view";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"cumulocity-helper" Starting');
    const detailView = new CumulocityViewProvider(context.extensionUri);
    const treeView = new CumulocityView(context, detailView);
    //context.subscriptions.push(vscode.window.registerTreeDataProvider("cumulocity-view", new CumulocityView(context, detailView)));

    const tree = vscode.window.createTreeView('cumulocity-view', { treeDataProvider: treeView, showCollapseAll: true });
    tree.onDidChangeSelection(e => detailView.postMessage(e.selection));
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(CumulocityViewProvider.viewType, detailView));
    console.log('"cumulocity-helper-extension" Initialized');
}



// this method is called when your extension is deactivated
export function deactivate() { }
