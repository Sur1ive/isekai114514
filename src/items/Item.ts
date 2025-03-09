import type { ItemIdentifier } from "./types";

export class Item {
	name: string;
	description: string;
	identifier: ItemIdentifier;
	constructor(identifier: ItemIdentifier) {
		this.identifier = identifier;
		this.name = "";
		this.description = "";
	}
}
