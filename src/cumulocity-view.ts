/** @format */

import * as vscode from "vscode";
import { CumulocityTreeItem } from "./cumulocity-items";
import { Client } from "@c8y/client";

export class CumulocityView implements vscode.TreeDataProvider<CumulocityTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CumulocityTreeItem | undefined> = new vscode.EventEmitter<CumulocityTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<CumulocityTreeItem | undefined> = this._onDidChangeTreeData.event;

    private workspaceList: CumulocityTreeItem[] = [];

    constructor(private context: vscode.ExtensionContext) {
        //undefined means that there is no folder open and so we should indicate this in the view.
        this.registerCommands(); //do this regardless
        if (vscode.workspace.workspaceFolders) {
            vscode.workspace.workspaceFolders.forEach((ws) => {
                let cfg = vscode.workspace.getConfiguration("cumulocity", ws.uri);
                console.log("CFG", ws, cfg.get("host"));
                this.workspaceList.push(
                    new CumulocityTreeItem(
                        ws.name,
                        vscode.TreeItemCollapsibleState.Collapsed,
                        context.asAbsolutePath("resources"),
                        "workspace",
                        undefined
                    )
                );
            });
        } else {
            this.workspaceList.push(
                new CumulocityTreeItem(
                    "Please open folder or workspace",
                    vscode.TreeItemCollapsibleState.None,
                    context.asAbsolutePath("resources"),
                    "placeholder",
                    undefined
                )
            );
        }
    }

    registerCommands(): void {
        if (this.context !== undefined) {
            this.context.subscriptions.push.apply(this.context.subscriptions, [
                vscode.commands.registerCommand("cumulocity.refresh", () => {
                    this.refresh();
                }),

                vscode.commands.registerCommand("cumulocity.createWorkspace", async () => {
                    const tenantURL: string | undefined = await vscode.window.showInputBox({
                        placeHolder: "enter cumulocity tenant url",
                    });
                    const user: string | undefined = await vscode.window.showInputBox({
                        placeHolder: "enter user",
                    });
                    const password: string | undefined = await vscode.window.showInputBox({
                        placeHolder: "enter password",
                    });
                    if (tenantURL && password) {
                        const client = await Client.authenticate(
                            {
                                user: user,
                                password: password,
                            },
                            tenantURL
                        );

                        const filter: object = {
                            pageSize: 2000,
                            withTotalPages: true,
                        };

                        const query = {
                            name: "*",
                        };

                        const { data, res, paging } = await client.inventory.listQueryDevices(query, filter);

                        console.log("RES", res);

                        if (data) {
                            console.log("DATA", data);
                        }
                        if (paging) {
                            console.log("PAGING", paging);
                            const nextPage = await paging.next();
                            console.log("NEXT", nextPage ? nextPage : "EMPTY");
                        }
                    }
                    this.refresh();
                }),

                vscode.commands.registerCommand("cumulocity.editWorkspace", async (element?: CumulocityTreeItem) => {
                    if (element) {
                        //Show the workspace details
                    }
                }),
            ]);
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: CumulocityTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: CumulocityTreeItem): Promise<undefined | CumulocityTreeItem[]> {
        if (element instanceof CumulocityTreeItem) {
            return element.children;
        }
        return this.workspaceList;
    }
}
