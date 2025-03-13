import { Rarity } from "./types";
import { ItemCategory } from "./items/types";
import type { Item } from "./items/Item";
import { ActionCategory } from "./actions/types";
import { Hit } from "./actions/Action";

export function getAppElement(): HTMLElement {
  const el = document.getElementById("app");
  if (!el) {
    throw new Error("无法找到挂载点 #app");
  }
  return el;
}

export function getRarityColor(rarity: Rarity): string {
  switch (rarity) {
    case Rarity.Unique:
      return "danger";
    case Rarity.Legendary:
      return "warning";
    case Rarity.Epic:
      return "info";
    case Rarity.Rare:
      return "success";
    default:
      return "secondary";
  }
}

export function getHitIcon(hit: Hit): string {
  switch (hit.category) {
    case ActionCategory.Attack:
      return "🗡️";
    case ActionCategory.Defend:
      return "🛡️";
    case ActionCategory.Dodge:
      return "💨";
    case ActionCategory.Capture:
      return "🕸️";
    case ActionCategory.DexAction:
      return "💫";
    case ActionCategory.StrAction:
      return "🦾";
    case ActionCategory.IntAction:
      return "📚";
    case ActionCategory.ConAction:
      return "❤️‍🔥";
    case ActionCategory.SizAction:
      return "🐋";
    case ActionCategory.AppAction:
      return "✨";
    case ActionCategory.NoAction:
      return "❔";
    default:
      return "";
  }
}

export function getItemIcon(item: Item): string {
  switch (item.category) {
    case ItemCategory.Equipment:
      return "🗡️";
    case ItemCategory.Consumable:
      return "🗝️";
    default:
      return "";
  }
}
