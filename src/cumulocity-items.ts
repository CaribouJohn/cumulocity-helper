/** @format */

import { Client, IManagedObject, IResultList } from "@c8y/client";
import * as vscode from "vscode";

export class CumulocityTreeItem extends vscode.TreeItem {
    public children: CumulocityTreeItem[] = [];
    constructor(
        public readonly label: string,
        public readonly detail: string,
        public readonly connString: string,
        public contextValue: string,
        public managedObject: IManagedObject | undefined = undefined
    ) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed);
    }

    // iconPath = {
    //     light: path.join(this.resourceDir, "light", "folder.svg"),
    //     dark: path.join(this.resourceDir, "dark", "folder.svg"),
    // };
    async getGroups(client: Client): Promise<CumulocityTreeItem[]> {
        let retrieved: CumulocityTreeItem[] = [];
        const filter2: object = {
            pageSize: 2000,
            withTotalPages: true,
            query: "((not(has(c8y_IsDynamicGroup.invisible))) and ((type eq 'c8y_DeviceGroup') or (type eq 'c8y_DynamicGroup')))",
        };

        let result = await client.inventory.list(filter2);
        if (result.res.status === 200) {
            do {
                result.data.forEach((mo) => {
                    let logString: string = mo.name;
                    let c: CumulocityTreeItem = new CumulocityTreeItem(logString, mo.id, this.connString, "group", mo);
                    retrieved.push(c);
                });

                if (result.paging.nextPage) {
                    result = await result.paging.next();
                }
            } while (result.paging && result.paging.nextPage);
        }
        //catch all group
        let c: CumulocityTreeItem = new CumulocityTreeItem("All Devices", "*", this.connString, "group");
        retrieved.push(c);
        return retrieved;
    }

    async getChildNodes(client: Client): Promise<CumulocityTreeItem[]> {
        let retrieved: CumulocityTreeItem[] = [];

        //get the 3 types of children for the node at id.
        const childFilter: object = {
            pageSize: 2000,
            withTotalPages: true,
            query: "(not(has(c8y_Dashboard)))",
        };

        //get the additions
        let result: IResultList<IManagedObject> = await client.inventory.childAdditionsList(this.detail, childFilter);

        if (result.res.status === 200) {
            do {
                result.data.forEach((mo) => {
                    let c: CumulocityTreeItem = new CumulocityTreeItem(mo.name, mo.id, this.connString, "addition", mo);
                    retrieved.push(c);
                });

                if (result.paging.nextPage) {
                    result = await result.paging.next();
                }
            } while (result.paging && result.paging.nextPage);
        }

        //get the assets
        result = await client.inventory.childAssetsList(this.detail, childFilter);

        if (result.res.status === 200) {
            do {
                result.data.forEach((mo) => {
                    let c: CumulocityTreeItem = new CumulocityTreeItem(mo.name, mo.id, this.connString, "asset", mo);
                    retrieved.push(c);
                });

                if (result.paging.nextPage) {
                    result = await result.paging.next();
                }
            } while (result.paging && result.paging.nextPage);
        }

        //get the assets
        result = await client.inventory.childDevicesList(this.detail, childFilter);

        if (result.res.status === 200) {
            do {
                result.data.forEach((mo) => {
                    let c: CumulocityTreeItem = new CumulocityTreeItem(mo.name, mo.id, this.connString, "device", mo);
                    retrieved.push(c);
                });

                if (result.paging.nextPage) {
                    result = await result.paging.next();
                }
            } while (result.paging && result.paging.nextPage);
        }
        console.log("ret", retrieved);
        return retrieved;
    }

    async getDevices(client: Client): Promise<CumulocityTreeItem[]> {
        let retrieved: CumulocityTreeItem[] = [];
        const filter: object = {
            pageSize: 2000,
            withTotalPages: true,
        };

        const query = {
            name: "*",
        };

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
                    let c: CumulocityTreeItem = new CumulocityTreeItem(logString, mo.id, this.connString, "device", mo);
                    retrieved.push(c);
                });
                if (result.paging.nextPage) {
                    result = await result.paging.next();
                }
            } while (result.paging && result.paging.nextPage);
        }

        return retrieved;
    }

    async scanDevices(context: vscode.ExtensionContext): Promise<CumulocityTreeItem[]> {
        //we must have a context or we won't be able to get the secrets to get the data.
        if (context) {
            //Using the transient "global" password we get the secret
            let conn: string[] = this.connString.split("@");
            let password = await context.secrets.get(this.connString);
            if (conn[0] && password) {
                try {
                    //connect to cumulocity
                    const client: Client = await Client.authenticate(
                        {
                            user: `${conn[1]}@${conn[2]}`,
                            password: password,
                        },
                        conn[0]
                    );

                    //clear data.
                    this.children = []; //truncate

                    if (this.contextValue === "workspace") {
                        this.children = await this.getGroups(client);
                    } else {
                        if (this.contextValue === "group" && this.detail === "*") {
                            this.children = await this.getDevices(client);
                        } else {
                            this.children = await this.getChildNodes(client);
                        }
                    }
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
