import { Rarity } from "../types";
import { Prefix } from "./Prefix";
// import { EquipmentPosition } from "./types";

export enum PrefixType {
  None = "None",
  // Legendary = "Legendary",
}

export const prefixConfigs: Record<PrefixType, Prefix> = {
  [PrefixType.None]: {
    name: "",
    description: "",
    position: "AnyPosition",
    rarity: Rarity.Common,
    extraActions: [],
    ability: {},
    actionCoeff: {},
  },
  // [PrefixType.Legendary]: {
  //   name: "神话的",
  //   description: "传奇级别的装备，拥有强大的力量",
  //   position: "AnyPosition",
  //   rarity: Rarity.Legendary,
  // },
};
