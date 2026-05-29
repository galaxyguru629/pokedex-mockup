import type {
  Battle,
  BattleLog,
  Team,
  Trainer,
} from '@prisma/client';

export type TrainerGql = Omit<Trainer, 'id'> & { id: string };
export type TeamGql = Omit<Team, 'id'> & { id: string };
export type BattleGql = Omit<Battle, 'id' | 'date'> & { id: string; date: string };
export type BattleLogGql = Omit<BattleLog, 'id' | 'timestamp'> & {
  id: string;
  timestamp: string;
};

export function toTrainerId(trainer: Trainer): TrainerGql {
  const { id, ...rest } = trainer;
  return { ...rest, id: String(id) };
}

export function toTeamId(team: Team): TeamGql {
  const { id, ...rest } = team;
  return { ...rest, id: String(id) };
}

export function toBattleId(battle: Battle): BattleGql {
  const { id, date, ...rest } = battle;
  return {
    ...rest,
    id: String(id),
    date: date.toISOString().slice(0, 10),
  };
}

export function toBattleLogId(log: BattleLog): BattleLogGql {
  const { id, timestamp, ...rest } = log;
  return {
    ...rest,
    id: String(id),
    timestamp: timestamp.toISOString(),
  };
}

export function parseId(id: string): number {
  const parsed = Number.parseInt(id, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid id: ${id}`);
  }
  return parsed;
}

export function parseOptionalIds(ids?: string[]): number[] | undefined {
  return ids?.map(parseId);
}

export function parseSortOrder(
  sortOrder?: string | null,
): 'asc' | 'desc' | undefined {
  if (!sortOrder) return undefined;
  return sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';
}
