import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export type TeamFilter = {
  ids?: number[];
  trainerId?: number;
  q?: string;
};

export type ListParams = {
  page?: number;
  perPage?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: TeamFilter;
};

const teamSortFields = new Set(['id', 'name', 'trainerId', 'createdAt']);

function buildWhere(filter?: TeamFilter): Prisma.TeamWhereInput {
  if (!filter) return {};

  const where: Prisma.TeamWhereInput = {};

  if (filter.ids?.length) {
    where.id = { in: filter.ids };
  }
  if (filter.trainerId !== undefined) {
    where.trainerId = filter.trainerId;
  }
  if (filter.q) {
    where.name = { contains: filter.q, mode: 'insensitive' };
  }

  return where;
}

export const teamRepository = {
  async findById(id: number) {
    return prisma.team.findUnique({ where: { id } });
  },

  async findByTrainerId(trainerId: number) {
    return prisma.team.findMany({ where: { trainerId } });
  },

  async findMany(params: ListParams = {}) {
    const { page = 0, perPage = 25, sortField = 'id', sortOrder = 'asc', filter } =
      params;
    const orderField = teamSortFields.has(sortField ?? 'id') ? sortField! : 'id';

    return prisma.team.findMany({
      where: buildWhere(filter),
      orderBy: { [orderField]: sortOrder },
      skip: page * perPage,
      take: perPage,
    });
  },

  async count(filter?: TeamFilter) {
    return prisma.team.count({ where: buildWhere(filter) });
  },

  async create(data: Prisma.TeamCreateInput) {
    return prisma.team.create({ data });
  },

  async update(id: number, data: Prisma.TeamUpdateInput) {
    return prisma.team.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.team.delete({ where: { id } });
  },
};
