import { ItemCategory, Rarity, ItemType } from "./types";

export abstract class Item {
	name: string;
	uuid: string;
	category: ItemCategory;
	type: ItemType;
	rarity: Rarity;
	description: string;
	constructor(name: string, uuid: string, category: ItemCategory, type: ItemType, rarity: Rarity, description: string) {
		this.name = name;
		this.uuid = uuid;
		this.category = category;
		this.type = type;
		this.rarity = rarity;
		this.description = description;
	}
}
