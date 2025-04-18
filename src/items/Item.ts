import { ItemCategory, ItemType } from "./types";
import { Rarity } from "../types";
import * as bootstrap from "bootstrap";

export abstract class Item {
  name: string;
  uuid: string;
  category: ItemCategory;
  type: ItemType;
  rarity: Rarity;
  level: number;
  description: string;
  constructor(
    name: string,
    uuid: string,
    category: ItemCategory,
    type: ItemType,
    rarity: Rarity,
    level: number,
    description: string,
  ) {
    this.name = name;
    this.uuid = uuid;
    this.category = category;
    this.type = type;
    this.rarity = rarity;
    this.level = level;
    this.description = description;
  }

  getName(): string {
    return this.name;
  }

  showItemToast() {
    const itemType = this.category === ItemCategory.Equipment ? "装备" : "道具";

    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.innerHTML = `
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">获得${itemType}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          获得了 ${this.getItemIcon()} <strong class="text-${Rarity[this.rarity]}">${this.getName()}</strong>！
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);

    const toastElement = toastContainer.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement as Element, {
      autohide: true,
      delay: 5000
    });
    toast.show();

    // Toast 隐藏后移除容器
    toastElement?.addEventListener('hidden.bs.toast', () => {
      toastContainer.remove();
    });
  }

  getItemIcon(): string {
    switch (this.category) {
      case ItemCategory.Equipment:
        return "🗡️";
      case ItemCategory.Consumable:
        return "🗝️";
      default:
        return "";
    }
  }
}
