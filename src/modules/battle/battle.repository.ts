import type { BattleResult, Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export type BattleFilter = {
  ids?: number[];
  trainerId?: number;
  teamId?: number;
  result?: BattleResult;
  q?: string;
};

export type ListParams = {
  page?: number;
  perPage?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: BattleFilter;
};

const battleSortFields = new Set([
  'id',
  'date',
  'result',
  'opponentName',
  'scoreTrainer',
  'scoreOpponent',
]);

function buildWhere(filter?: BattleFilter): Prisma.BattleWhereInput {
  if (!filter) return {};

  const where: Prisma.BattleWhereInput = {};

  if (filter.ids?.length) {
    where.id = { in: filter.ids };
  }
  if (filter.trainerId !== undefined) {
    where.trainerId = filter.trainerId;
  }
  if (filter.teamId !== undefined) {
    where.teamId = filter.teamId;
  }
  if (filter.result) {
    where.result = filter.result;
  }
  if (filter.q) {
    where.opponentName = { contains: filter.q, mode: 'insensitive' };
  }

  return where;
}

export const battleRepository = {
  async findById(id: number) {
    return prisma.battle.findUnique({ where: { id } });
  },

  async findByTrainerId(trainerId: number) {
    return prisma.battle.findMany({
      where: { trainerId },
      orderBy: { date: 'desc' },
    });
  },

  async findMany(params: ListParams = {}) {
    const { page = 0, perPage = 25, sortField = 'id', sortOrder = 'asc', filter } =
      params;
    const orderField = battleSortFields.has(sortField ?? 'id')
      ? sortField!
      : 'id';

    return prisma.battle.findMany({
      where: buildWhere(filter),
      orderBy: { [orderField]: sortOrder },
      skip: page * perPage,
      take: perPage,
    });
  },

  async count(filter?: BattleFilter) {
    return prisma.battle.count({ where: buildWhere(filter) });
  },

  async create(data: Prisma.BattleCreateInput) {
    return prisma.battle.create({ data });
  },

  async update(id: number, data: Prisma.BattleUpdateInput) {
    return prisma.battle.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.battle.delete({ where: { id } });
  },
};
