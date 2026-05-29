import type { Prisma } from '@prisma/client';
import { NotFoundError } from '../../shared/errors/app-error';
import {
  battleLogRepository,
  type BattleLogFilter,
  type ListParams,
} from './battle-log.repository';

export const battleLogService = {
  getById(id: number) {
    return battleLogRepository.findById(id);
  },

  listByBattle(battleId: number) {
    return battleLogRepository.findByBattleId(battleId);
  },

  list(params: ListParams) {
    return battleLogRepository.findMany(params);
  },

  count(filter?: BattleLogFilter) {
    return battleLogRepository.count(filter);
  },

  create(data: Prisma.BattleLogCreateInput) {
    return battleLogRepository.create(data);
  },

  async update(id: number, data: Prisma.BattleLogUpdateInput) {
    const existing = await battleLogRepository.findById(id);
    if (!existing) throw new NotFoundError('BattleLog', id);
    return battleLogRepository.update(id, data);
  },

  async remove(id: number) {
    const existing = await battleLogRepository.findById(id);
    if (!existing) throw new NotFoundError('BattleLog', id);
    return battleLogRepository.delete(id);
  },
};
