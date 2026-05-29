import { trainerService } from '../modules/trainer/trainer.service';
import { teamService } from '../modules/team/team.service';
import { battleService } from '../modules/battle/battle.service';
import { battleLogService } from '../modules/battle-log/battle-log.service';
import {
  parseId,
  parseOptionalIds,
  parseSortOrder,
  toBattleId,
  toBattleLogId,
  toTeamId,
  toTrainerId,
} from './serializers';

export const resolvers = {
  Query: {
    trainer: async (_: unknown, { id }: { id: string }) => {
      const trainer = await trainerService.getById(parseId(id));
      return trainer ? toTrainerId(trainer) : null;
    },

    allTrainers: async (
      _: unknown,
      args: {
        page?: number;
        perPage?: number;
        sortField?: string;
        sortOrder?: string;
        filter?: { ids?: string[]; region?: string; rank?: string; q?: string };
      },
    ) => {
      const trainers = await trainerService.list({
        page: args.page,
        perPage: args.perPage,
        sortField: args.sortField,
        sortOrder: parseSortOrder(args.sortOrder),
        filter: args.filter
          ? { ...args.filter, ids: parseOptionalIds(args.filter.ids) }
          : undefined,
      });
      return trainers.map(toTrainerId);
    },

    _allTrainersMeta: async (
      _: unknown,
      args: {
        filter?: { ids?: string[]; region?: string; rank?: string; q?: string };
      },
    ) => {
      const count = await trainerService.count(
        args.filter
          ? { ...args.filter, ids: parseOptionalIds(args.filter.ids) }
          : undefined,
      );
      return { count };
    },

    team: async (_: unknown, { id }: { id: string }) => {
      const team = await teamService.getById(parseId(id));
      return team ? toTeamId(team) : null;
    },

    allTeams: async (
      _: unknown,
      args: {
        page?: number;
        perPage?: number;
        sortField?: string;
        sortOrder?: string;
        filter?: { ids?: string[]; trainerId?: number; q?: string };
      },
    ) => {
      const teams = await teamService.list({
        page: args.page,
        perPage: args.perPage,
        sortField: args.sortField,
        sortOrder: parseSortOrder(args.sortOrder),
        filter: args.filter
          ? { ...args.filter, ids: parseOptionalIds(args.filter.ids) }
          : undefined,
      });
      return teams.map(toTeamId);
    },

    _allTeamsMeta: async (
      _: unknown,
      args: {
        filter?: { ids?: string[]; trainerId?: number; q?: string };
      },
    ) => {
      const count = await teamService.count(
        args.filter
          ? { ...args.filter, ids: parseOptionalIds(args.filter.ids) }
          : undefined,
      );
      return { count };
    },

    battle: async (_: unknown, { id }: { id: string }) => {
      const battle = await battleService.getById(parseId(id));
      return battle ? toBattleId(battle) : null;
    },

    allBattles: async (
      _: unknown,
      args: {
        page?: number;
        perPage?: number;
        sortField?: string;
        sortOrder?: string;
        filter?: {
          ids?: string[];
          trainerId?: number;
          teamId?: number;
          result?: 'win' | 'loss';
          q?: string;
        };
      },
    ) => {
      const battles = await battleService.list({
        page: args.page,
        perPage: args.perPage,
        sortField: args.sortField,
        sortOrder: parseSortOrder(args.sortOrder),
        filter: args.filter
          ? { ...args.filter, ids: parseOptionalIds(args.filter.ids) }
          : undefined,
      });
      return battles.map(toBattleId);
    },

    _allBattlesMeta: async (
      _: unknown,
      args: {
        filter?: {
          ids?: string[];
          trainerId?: number;
          teamId?: number;
          result?: 'win' | 'loss';
          q?: string;
        };
      },
    ) => {
      const count = await battleService.count(
        args.filter
          ? { ...args.filter, ids: parseOptionalIds(args.filter.ids) }
          : undefined,
      );
      return { count };
    },

    battleLog: async (_: unknown, { id }: { id: string }) => {
      const log = await battleLogService.getById(parseId(id));
      return log ? toBattleLogId(log) : null;
    },

    allBattleLogs: async (
      _: unknown,
      args: {
        page?: number;
        perPage?: number;
        sortField?: string;
        sortOrder?: string;
        filter?: {
          ids?: string[];
          battleId?: number;
          severity?: 'success' | 'info' | 'danger' | 'warning';
          q?: string;
        };
      },
    ) => {
      const logs = await battleLogService.list({
        page: args.page,
        perPage: args.perPage,
        sortField: args.sortField,
        sortOrder: parseSortOrder(args.sortOrder),
        filter: args.filter
          ? { ...args.filter, ids: parseOptionalIds(args.filter.ids) }
          : undefined,
      });
      return logs.map(toBattleLogId);
    },

    _allBattleLogsMeta: async (
      _: unknown,
      args: {
        filter?: {
          ids?: string[];
          battleId?: number;
          severity?: 'success' | 'info' | 'danger' | 'warning';
          q?: string;
        };
      },
    ) => {
      const count = await battleLogService.count(
        args.filter
          ? { ...args.filter, ids: parseOptionalIds(args.filter.ids) }
          : undefined,
      );
      return { count };
    },
  },

  Mutation: {
    createTrainer: async (
      _: unknown,
      args: {
        name: string;
        badgeCount: number;
        region: string;
        avatarUrl?: string;
        rank: string;
      },
    ) => {
      const trainer = await trainerService.create({
        name: args.name,
        badgeCount: args.badgeCount,
        region: args.region,
        avatarUrl: args.avatarUrl ?? '',
        rank: args.rank,
      });
      return toTrainerId(trainer);
    },

    updateTrainer: async (
      _: unknown,
      args: {
        id: string;
        name?: string;
        badgeCount?: number;
        region?: string;
        avatarUrl?: string;
        rank?: string;
      },
    ) => {
      const { id, ...data } = args;
      const trainer = await trainerService.update(parseId(id), data);
      return toTrainerId(trainer);
    },

    removeTrainer: async (_: unknown, { id }: { id: string }) => {
      const trainer = await trainerService.remove(parseId(id));
      return toTrainerId(trainer);
    },

    deleteTrainer: async (_: unknown, { id }: { id: string }) => {
      const trainer = await trainerService.remove(parseId(id));
      return toTrainerId(trainer);
    },

    createTeam: async (
      _: unknown,
      args: { trainerId: number; name: string; pokemonIds: number[] },
    ) => {
      const team = await teamService.create({
        name: args.name,
        pokemonIds: args.pokemonIds,
        trainer: { connect: { id: args.trainerId } },
      });
      return toTeamId(team);
    },

    updateTeam: async (
      _: unknown,
      args: {
        id: string;
        trainerId?: number;
        name?: string;
        pokemonIds?: number[];
      },
    ) => {
      const { id, trainerId, ...data } = args;
      const team = await teamService.update(parseId(id), {
        ...data,
        ...(trainerId !== undefined
          ? { trainer: { connect: { id: trainerId } } }
          : {}),
      });
      return toTeamId(team);
    },

    removeTeam: async (_: unknown, { id }: { id: string }) => {
      const team = await teamService.remove(parseId(id));
      return toTeamId(team);
    },

    deleteTeam: async (_: unknown, { id }: { id: string }) => {
      const team = await teamService.remove(parseId(id));
      return toTeamId(team);
    },

    createBattle: async (
      _: unknown,
      args: {
        trainerId: number;
        opponentName: string;
        teamId: number;
        result: 'win' | 'loss';
        date: string;
        scoreTrainer: number;
        scoreOpponent: number;
      },
    ) => {
      const battle = await battleService.create({
        opponentName: args.opponentName,
        result: args.result,
        date: new Date(args.date),
        scoreTrainer: args.scoreTrainer,
        scoreOpponent: args.scoreOpponent,
        trainer: { connect: { id: args.trainerId } },
        team: { connect: { id: args.teamId } },
      });
      return toBattleId(battle);
    },

    updateBattle: async (
      _: unknown,
      args: {
        id: string;
        trainerId?: number;
        opponentName?: string;
        teamId?: number;
        result?: 'win' | 'loss';
        date?: string;
        scoreTrainer?: number;
        scoreOpponent?: number;
      },
    ) => {
      const { id, trainerId, teamId, date, ...data } = args;
      const battle = await battleService.update(parseId(id), {
        ...data,
        ...(date !== undefined ? { date: new Date(date) } : {}),
        ...(trainerId !== undefined
          ? { trainer: { connect: { id: trainerId } } }
          : {}),
        ...(teamId !== undefined ? { team: { connect: { id: teamId } } } : {}),
      });
      return toBattleId(battle);
    },

    removeBattle: async (_: unknown, { id }: { id: string }) => {
      const battle = await battleService.remove(parseId(id));
      return toBattleId(battle);
    },

    deleteBattle: async (_: unknown, { id }: { id: string }) => {
      const battle = await battleService.remove(parseId(id));
      return toBattleId(battle);
    },

    createBattleLog: async (
      _: unknown,
      args: {
        battleId: number;
        timestamp: string;
        message: string;
        severity: 'success' | 'info' | 'danger' | 'warning';
      },
    ) => {
      const log = await battleLogService.create({
        timestamp: new Date(args.timestamp),
        message: args.message,
        severity: args.severity,
        battle: { connect: { id: args.battleId } },
      });
      return toBattleLogId(log);
    },

    updateBattleLog: async (
      _: unknown,
      args: {
        id: string;
        battleId?: number;
        timestamp?: string;
        message?: string;
        severity?: 'success' | 'info' | 'danger' | 'warning';
      },
    ) => {
      const { id, battleId, timestamp, ...data } = args;
      const log = await battleLogService.update(parseId(id), {
        ...data,
        ...(timestamp !== undefined ? { timestamp: new Date(timestamp) } : {}),
        ...(battleId !== undefined
          ? { battle: { connect: { id: battleId } } }
          : {}),
      });
      return toBattleLogId(log);
    },

    removeBattleLog: async (_: unknown, { id }: { id: string }) => {
      const log = await battleLogService.remove(parseId(id));
      return toBattleLogId(log);
    },

    deleteBattleLog: async (_: unknown, { id }: { id: string }) => {
      const log = await battleLogService.remove(parseId(id));
      return toBattleLogId(log);
    },
  },

  Trainer: {
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
    updatedAt: (parent: { updatedAt: Date }) => parent.updatedAt.toISOString(),
    teams: async (parent: { id: string | number }) => {
      const trainerId =
        typeof parent.id === 'string' ? parseId(parent.id) : parent.id;
      const teams = await teamService.listByTrainer(trainerId);
      return teams.map(toTeamId);
    },
    battles: async (parent: { id: string | number }) => {
      const trainerId =
        typeof parent.id === 'string' ? parseId(parent.id) : parent.id;
      const battles = await battleService.listByTrainer(trainerId);
      return battles.map(toBattleId);
    },
  },

  Team: {
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
    updatedAt: (parent: { updatedAt: Date }) => parent.updatedAt.toISOString(),
    trainer: async (parent: { trainerId: number }) => {
      const trainer = await trainerService.getById(parent.trainerId);
      return trainer ? toTrainerId(trainer) : null;
    },
    battles: async (parent: { id: string | number }) => {
      const teamId =
        typeof parent.id === 'string' ? parseId(parent.id) : parent.id;
      const battles = await battleService.list({
        filter: { teamId },
      });
      return battles.map(toBattleId);
    },
  },

  Battle: {
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
    updatedAt: (parent: { updatedAt: Date }) => parent.updatedAt.toISOString(),
    trainer: async (parent: { trainerId: number }) => {
      const trainer = await trainerService.getById(parent.trainerId);
      return trainer ? toTrainerId(trainer) : null;
    },
    team: async (parent: { teamId: number }) => {
      const team = await teamService.getById(parent.teamId);
      return team ? toTeamId(team) : null;
    },
    battleLogs: async (parent: { id: string | number }) => {
      const battleId =
        typeof parent.id === 'string' ? parseId(parent.id) : parent.id;
      const logs = await battleLogService.listByBattle(battleId);
      return logs.map(toBattleLogId);
    },
  },

  BattleLog: {
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
    battle: async (parent: { battleId: number }) => {
      const battle = await battleService.getById(parent.battleId);
      return battle ? toBattleId(battle) : null;
    },
  },
};
