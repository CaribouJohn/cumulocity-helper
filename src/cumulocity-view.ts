/** @format */

import * as vscode from "vscode";
import { CumulocityTreeItem } from "./cumulocity-items";
import { CumulocityViewProvider } from "./cumulocity-detail-view";
import * as cadk from "cumulocity-adk";

export class CumulocityView implements vscode.TreeDataProvider<CumulocityTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CumulocityTreeItem | undefined> = new vscode.EventEmitter<CumulocityTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<CumulocityTreeItem | undefined> = this._onDidChangeTreeData.event;

    public static cumulocityKey: string = "cumulocity.data";
    public static tenantsKey: string = "tenantsKey";
    private static reference: CumulocityTreeItem = new CumulocityTreeItem("ref", "ref", "ref", "ref");

    private workspaceList: CumulocityTreeItem[] = [];
    constructor(private context: vscode.ExtensionContext, private view: CumulocityViewProvider) {
        //undefined means that there is no folder open and so we should indicate this in the view.
        this.registerCommands(); //do this regardless
    }

    public async createWidgetInExplorer(uri: vscode.Uri) {
        const widgetName: string | undefined = await vscode.window.showInputBox({
            placeHolder: "Enter the widget name you want to use",
            prompt: "Enter the widget name, E.G. my.cool.widget",
        });
        if (widgetName) {
            //console.log(uri.fsPath);
            try {
                await cadk.createWidget({ name: widgetName, destination: uri.fsPath, type: "widget" });
                vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.joinPath(uri, widgetName));
            } catch (err) {
                //console.log("ERROR" + err);
            }
        }
    }

    public async createWidget(element?: CumulocityTreeItem) {
        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Select',
            canSelectFiles: false,
            canSelectFolders: true
        };

        vscode.window.showOpenDialog(options).then(async fileUri => {
            if (fileUri) {
                await this.createWidgetInExplorer(fileUri[0]);
            }
        });
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

                    let c: CumulocityTreeItem = new CumulocityTreeItem(tenantURL, "", `${tenantURL}@${user}`, "workspace");

                    //c.context = this.context;

                    if (this.workspaceList) {
                        this.workspaceList.push(c);
                    } else {
                        this.workspaceList = [c];
                    }

                    try {
                        //console.log(JSON.stringify(this.workspaceList));
                        this.context.workspaceState.update(CumulocityView.cumulocityKey, this.workspaceList);
                        //console.log("value added");
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
                //console.log("value deleted");
                this.refresh();
            });
        }
        this.refresh();
    }

    async registerCommands(): Promise<void> {
        //We need to initialize with the data

        if (this.context !== undefined) {
            let stored: CumulocityTreeItem[] = this.context.workspaceState.get(CumulocityView.cumulocityKey);
            this.workspaceList = stored ? stored.map(
                (item) => new CumulocityTreeItem(item.label, item.detail, item.connString, item.contextValue, item.managedObject)
            ) : [];

            //console.log("WORKSPACE LIST", this.workspaceList);

            this.context.subscriptions.push.apply(this.context.subscriptions, [
                //create a widget in file explorer view, 
                vscode.commands.registerCommand('cumulocity.createWidgetInExplorer', async (uri: vscode.Uri) => {

                    await this.createWidgetInExplorer(uri);

                }),
                //create a widget in cumulocity view, 
                vscode.commands.registerCommand('cumulocity.createWidget', async (element?: CumulocityTreeItem) => {

                    await this.createWidget(element);

                }),
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

                //edit the managed object
                vscode.commands.registerCommand("cumulocity.viewManagedObject", async (element?: CumulocityTreeItem) => {
                    if (element && element.managedObject) {
                        let doc: vscode.TextDocument = await vscode.workspace.openTextDocument({
                            content: JSON.stringify(element.managedObject, undefined, 4),
                            language: "json"
                        });

                        if (doc) {
                            vscode.window.showTextDocument(doc, { preview: false });
                        }
                    }
                })
            ]);
        } else {
            //console.log("No context! - error initializing extension");
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: CumulocityTreeItem): vscode.TreeItem {
        this.workspaceList.forEach((item) => (item.children = []));
        return element;
    }

    async getChildren(element?: CumulocityTreeItem): Promise<undefined | CumulocityTreeItem[]> {
        if (element instanceof CumulocityTreeItem) {
            //console.log(<CumulocityTreeItem>element);
            await element.scanDevices(this.context); //needs access to secrets
            //console.log("element clicked", element);
            return element.children;
        }
        return this.workspaceList;
    }
}
