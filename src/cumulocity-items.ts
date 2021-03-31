/** @format */

import * as vscode from "vscode";

export class CumulocityTreeItem extends vscode.TreeItem {
    public children: CumulocityTreeItem[] = [];

    constructor(
        public readonly label: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public resourceDir: string,
        public contextValue: string,
        public parent: CumulocityTreeItem
    ) {
        super(label, collapsibleState);
    }

    // iconPath = {
    //     light: path.join(this.resourceDir, "light", "folder.svg"),
    //     dark: path.join(this.resourceDir, "dark", "folder.svg"),
    // };

    async scanDevices(): Promise<CumulocityTreeItem[]> {
        return this.children;
    }
}
