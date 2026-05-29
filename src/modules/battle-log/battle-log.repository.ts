import type { LogSeverity, Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export type BattleLogFilter = {
  ids?: number[];
  battleId?: number;
  severity?: LogSeverity;
  q?: string;
};

export type ListParams = {
  page?: number;
  perPage?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: BattleLogFilter;
};

const logSortFields = new Set(['id', 'timestamp', 'severity']);

function buildWhere(filter?: BattleLogFilter): Prisma.BattleLogWhereInput {
  if (!filter) return {};

  const where: Prisma.BattleLogWhereInput = {};

  if (filter.ids?.length) {
    where.id = { in: filter.ids };
  }
  if (filter.battleId !== undefined) {
    where.battleId = filter.battleId;
  }
  if (filter.severity) {
    where.severity = filter.severity;
  }
  if (filter.q) {
    where.message = { contains: filter.q, mode: 'insensitive' };
  }

  return where;
}

export const battleLogRepository = {
  async findById(id: number) {
    return prisma.battleLog.findUnique({ where: { id } });
  },

  async findByBattleId(battleId: number) {
    return prisma.battleLog.findMany({
      where: { battleId },
      orderBy: { timestamp: 'asc' },
    });
  },

  async findMany(params: ListParams = {}) {
    const { page = 0, perPage = 25, sortField = 'id', sortOrder = 'asc', filter } =
      params;
    const orderField = logSortFields.has(sortField ?? 'id') ? sortField! : 'id';

    return prisma.battleLog.findMany({
      where: buildWhere(filter),
      orderBy: { [orderField]: sortOrder },
      skip: page * perPage,
      take: perPage,
    });
  },

  async count(filter?: BattleLogFilter) {
    return prisma.battleLog.count({ where: buildWhere(filter) });
  },

  async create(data: Prisma.BattleLogCreateInput) {
    return prisma.battleLog.create({ data });
  },

  async update(id: number, data: Prisma.BattleLogUpdateInput) {
    return prisma.battleLog.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.battleLog.delete({ where: { id } });
  },
};
