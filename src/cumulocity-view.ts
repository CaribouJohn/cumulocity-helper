/** @format */

import * as vscode from "vscode";
import { CumulocityTreeItem } from "./cumulocity-items";
import { Client } from "@c8y/client";

export class CumulocityView implements vscode.TreeDataProvider<CumulocityTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CumulocityTreeItem | undefined> = new vscode.EventEmitter<CumulocityTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<CumulocityTreeItem | undefined> = this._onDidChangeTreeData.event;

    public static cumulocityKey: string = "cumulocity.data";
    public static tenantsKey: string = "tenantsKey";
    private static reference: CumulocityTreeItem = new CumulocityTreeItem("ref", "ref", "ref");

    private workspaceList: CumulocityTreeItem[] = [];
    constructor(private context: vscode.ExtensionContext) {
        //undefined means that there is no folder open and so we should indicate this in the view.
        this.registerCommands(); //do this regardless
    }

    public async createTenantRecord() {
        const tenantURL: string | undefined = await vscode.window.showInputBox({
            placeHolder: "enter cumulocity tenant url",
            prompt: "Enter the tenant, E.G. https://demo.cumulocity.com/",
        });
        if (tenantURL) {
            const user: string | undefined = await vscode.window.showInputBox({
                placeHolder: "enter user",
                prompt: "Enter tenant user name (Case sensitive), E.G user@softwareag.com",
            });
            if (user) {
                const password: string | undefined = await vscode.window.showInputBox({
                    placeHolder: "******",
                    password: true,
                    prompt: "Enter password (Securely stored)",
                });
                if (password) {
                    //store it
                    this.context.secrets.store(`${tenantURL}@${user}`, password);

                    let c: CumulocityTreeItem = new CumulocityTreeItem(tenantURL, `${tenantURL}@${user}`, "workspace");

                    //c.context = this.context;

                    if (this.workspaceList) {
                        this.workspaceList.push(c);
                    } else {
                        this.workspaceList = [c];
                    }

                    try {
                        console.log(JSON.stringify(this.workspaceList));
                        this.context.workspaceState.update(CumulocityView.cumulocityKey, this.workspaceList);
                        console.log("value added");
                        this.refresh();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }
    }

    public async deleteTenantRecord(tbd: CumulocityTreeItem) {
        //remove password it
        this.context.secrets.delete(tbd.detail);

        if (this.workspaceList) {
            this.workspaceList.splice(this.workspaceList.indexOf(tbd), 1);
            this.context.workspaceState.update(CumulocityView.cumulocityKey, this.workspaceList).then(() => {
                console.log("value deleted");
                this.refresh();
            });
        }
        this.refresh();
    }

    async registerCommands(): Promise<void> {
        //We need to initialize with the data

        if (this.context !== undefined) {
            let stored: CumulocityTreeItem[] = this.context.workspaceState.get(CumulocityView.cumulocityKey);
            stored.forEach((current) => {
                Object.setPrototypeOf(current, Object.getPrototypeOf(CumulocityView.reference));
            });
            this.workspaceList = stored;
            console.log("WORKSPACE LIST", this.workspaceList);

            this.context.subscriptions.push.apply(this.context.subscriptions, [
                //Refresh the view.
                vscode.commands.registerCommand("cumulocity.refresh", () => {
                    this.refresh();
                }),

                //Open a tenant and read in data
                vscode.commands.registerCommand("cumulocity.createTenantRecord", async () => {
                    await this.createTenantRecord();
                }),

                //allow workspace to be edited
                vscode.commands.registerCommand("cumulocity.deleteWorkspace", async (element?: CumulocityTreeItem) => {
                    if (element) {
                        await this.deleteTenantRecord(element);
                    }
                }),
            ]);
        } else {
            console.log("No context! - error initializing extension");
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: CumulocityTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: CumulocityTreeItem): Promise<undefined | CumulocityTreeItem[]> {
        console.log(element);
        if (element instanceof CumulocityTreeItem) {
            console.log(<CumulocityTreeItem>element);
            element.scanDevices(this.context); //needs access to secrets
            return element.children;
        }
        return this.workspaceList;
    }
}
