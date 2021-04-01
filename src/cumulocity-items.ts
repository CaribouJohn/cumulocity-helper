/** @format */

import { Client, IManagedObject, IResultList } from "@c8y/client";
import * as vscode from "vscode";

export class CumulocityTreeItem extends vscode.TreeItem {
    public children: CumulocityTreeItem[] = [];
    constructor(
        public readonly label: string,
        public readonly detail: string,
        public contextValue: string,
        public managedObject: IManagedObject | undefined = undefined
    ) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed);
    }

    // iconPath = {
    //     light: path.join(this.resourceDir, "light", "folder.svg"),
    //     dark: path.join(this.resourceDir, "dark", "folder.svg"),
    // };

    async scanDevices(context: vscode.ExtensionContext): Promise<CumulocityTreeItem[]> {
        if (context) {
            let conn: string[] = this.detail.split("@");
            let password = await context.secrets.get(this.detail);

            if (conn[0] && password) {
                try {
                    const client = await Client.authenticate(
                        {
                            user: `${conn[1]}@${conn[2]}`,
                            password: password,
                        },
                        conn[0]
                    );

                    const filter: object = {
                        pageSize: 2000,
                        withTotalPages: true,
                    };

                    const query = {
                        name: "*",
                    };

                    this.children = []; //truncate

                    let result: IResultList<IManagedObject> = await client.inventory.listQueryDevices(query, filter);
                    if (result.res.status === 200) {
                        do {
                            result.data.forEach((mo) => {
                                let logString: string = mo.name;
                                logString += "(" + mo.id + "|";
                                logString += mo.type ? mo.type + "|" : "no type|";
                                logString += mo.owner ? mo.owner + "|" : "no owner|";
                                logString += mo.childDevices.references.length ? mo.childDevices.references.length + "children " : "";
                                logString += ")";
                                console.log(mo);
                                let c: CumulocityTreeItem = new CumulocityTreeItem(logString, mo.id, "device", mo);
                                this.children.push(c);
                            });

                            if (result.paging.nextPage) {
                                result = await result.paging.next();
                            }
                        } while (result.paging && result.paging.nextPage);
                    }

                    const filter2: object = {
                        pageSize: 2000,
                        withTotalPages: true,
                        query: "((not(has(c8y_IsDynamicGroup.invisible))) and ((type eq 'c8y_DeviceGroup') or (type eq 'c8y_DynamicGroup')))",
                    };

                    result = await client.inventory.list(filter2);

                    console.log(result);
                } catch (e) {
                    console.log(e);
                    return []; //error node possibly? Toast?
                }
            } else {
                console.log("Extension context not set on object");
            }
            return this.children;
        }
    }
}
