export enum CreatureStatusType {
  Poison = 'poison',
  Sleep = 'sleep',
  Stun = 'stun',
  Confuse = 'confuse',
  Paralyze = 'paralyze',
	Pain = 'pain',
}

export interface CreatureStatus {
	type: CreatureStatusType;
	duration: number;
}

