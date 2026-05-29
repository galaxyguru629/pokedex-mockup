import gql from 'graphql-tag';

export const typeDefs = gql`
  enum BattleResult {
    win
    loss
  }

  enum LogSeverity {
    success
    info
    danger
    warning
  }

  type Trainer {
    id: ID!
    name: String!
    badgeCount: Int!
    region: String!
    avatarUrl: String!
    rank: String!
    createdAt: String!
    updatedAt: String!
    teams: [Team!]!
    battles: [Battle!]!
  }

  type Team {
    id: ID!
    trainerId: Int!
    name: String!
    pokemonIds: [Int!]!
    createdAt: String!
    updatedAt: String!
    trainer: Trainer!
    battles: [Battle!]!
  }

  type Battle {
    id: ID!
    trainerId: Int!
    opponentName: String!
    teamId: Int!
    result: BattleResult!
    date: String!
    scoreTrainer: Int!
    scoreOpponent: Int!
    createdAt: String!
    updatedAt: String!
    trainer: Trainer!
    team: Team!
    battleLogs: [BattleLog!]!
  }

  type BattleLog {
    id: ID!
    battleId: Int!
    timestamp: String!
    message: String!
    severity: LogSeverity!
    createdAt: String!
    battle: Battle!
  }

  type ListMetadata {
    count: Int!
  }

  input TrainerFilter {
    ids: [ID!]
    region: String
    rank: String
    q: String
  }

  input TeamFilter {
    ids: [ID!]
    trainerId: Int
    q: String
  }

  input BattleFilter {
    ids: [ID!]
    trainerId: Int
    teamId: Int
    result: BattleResult
    q: String
  }

  input BattleLogFilter {
    ids: [ID!]
    battleId: Int
    severity: LogSeverity
    q: String
  }

  type Query {
    trainer(id: ID!): Trainer
    allTrainers(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: TrainerFilter
    ): [Trainer!]!
    _allTrainersMeta(page: Int, perPage: Int, filter: TrainerFilter): ListMetadata!

    team(id: ID!): Team
    allTeams(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: TeamFilter
    ): [Team!]!
    _allTeamsMeta(page: Int, perPage: Int, filter: TeamFilter): ListMetadata!

    battle(id: ID!): Battle
    allBattles(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: BattleFilter
    ): [Battle!]!
    _allBattlesMeta(page: Int, perPage: Int, filter: BattleFilter): ListMetadata!

    battleLog(id: ID!): BattleLog
    allBattleLogs(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: BattleLogFilter
    ): [BattleLog!]!
    _allBattleLogsMeta(
      page: Int
      perPage: Int
      filter: BattleLogFilter
    ): ListMetadata!
  }

  type Mutation {
    createTrainer(
      name: String!
      badgeCount: Int!
      region: String!
      avatarUrl: String
      rank: String!
    ): Trainer!

    updateTrainer(
      id: ID!
      name: String
      badgeCount: Int
      region: String
      avatarUrl: String
      rank: String
    ): Trainer!

    removeTrainer(id: ID!): Trainer
    deleteTrainer(id: ID!): Trainer

    createTeam(
      trainerId: Int!
      name: String!
      pokemonIds: [Int!]!
    ): Team!

    updateTeam(
      id: ID!
      trainerId: Int
      name: String
      pokemonIds: [Int!]
    ): Team!

    removeTeam(id: ID!): Team
    deleteTeam(id: ID!): Team

    createBattle(
      trainerId: Int!
      opponentName: String!
      teamId: Int!
      result: BattleResult!
      date: String!
      scoreTrainer: Int!
      scoreOpponent: Int!
    ): Battle!

    updateBattle(
      id: ID!
      trainerId: Int
      opponentName: String
      teamId: Int
      result: BattleResult
      date: String
      scoreTrainer: Int
      scoreOpponent: Int
    ): Battle!

    removeBattle(id: ID!): Battle
    deleteBattle(id: ID!): Battle

    createBattleLog(
      battleId: Int!
      timestamp: String!
      message: String!
      severity: LogSeverity!
    ): BattleLog!

    updateBattleLog(
      id: ID!
      battleId: Int
      timestamp: String
      message: String
      severity: LogSeverity
    ): BattleLog!

    removeBattleLog(id: ID!): BattleLog
    deleteBattleLog(id: ID!): BattleLog
  }
`;
