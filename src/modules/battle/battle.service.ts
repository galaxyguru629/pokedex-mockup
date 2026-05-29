import type { Prisma } from '@prisma/client';
import { NotFoundError } from '../../shared/errors/app-error';
import {
  battleRepository,
  type BattleFilter,
  type ListParams,
} from './battle.repository';

export const battleService = {
  getById(id: number) {
    return battleRepository.findById(id);
  },

  listByTrainer(trainerId: number) {
    return battleRepository.findByTrainerId(trainerId);
  },

  list(params: ListParams) {
    return battleRepository.findMany(params);
  },

  count(filter?: BattleFilter) {
    return battleRepository.count(filter);
  },

  create(data: Prisma.BattleCreateInput) {
    return battleRepository.create(data);
  },

  async update(id: number, data: Prisma.BattleUpdateInput) {
    const existing = await battleRepository.findById(id);
    if (!existing) throw new NotFoundError('Battle', id);
    return battleRepository.update(id, data);
  },

  async remove(id: number) {
    const existing = await battleRepository.findById(id);
    if (!existing) throw new NotFoundError('Battle', id);
    return battleRepository.delete(id);
  },
};
