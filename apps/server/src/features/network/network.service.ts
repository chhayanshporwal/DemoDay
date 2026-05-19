import { AppError } from '../../middlewares/errorHandler';

// TODO: Import neo4j-driver and create session in Phase 4
// import neo4j from 'neo4j-driver';
// import { config } from '../../config/env';

export async function createConnection(userId: string, targetUserId: string) {
  if (userId === targetUserId) {
    throw new AppError('Cannot connect with yourself', 400);
  }

  // TODO (Phase 4): Execute Neo4j Cypher query
  // const session = driver.session();
  // await session.run(
  //   `MATCH (a:User {id: $userId}), (b:User {id: $targetId})
  //    MERGE (a)-[:CONNECTED_WITH {status: "accepted", created_at: datetime()}]-(b)`,
  //   { userId, targetId: targetUserId }
  // );

  return {
    message: 'Connection request sent',
    from: userId,
    to: targetUserId,
    status: 'pending',
  };
}

export async function getSuggestedConnections(userId: string) {
  // TODO (Phase 4): Execute Neo4j query for 2nd-degree connections with shared skills
  // MATCH (me:User {id: $userId})-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(suggested:User)
  // WHERE me <> suggested AND NOT (me)-[:CONNECTED_WITH]-(suggested)
  // RETURN DISTINCT suggested.id, collect(s.name) as shared_skills, count(s) as skill_overlap
  // ORDER BY skill_overlap DESC LIMIT 20

  return {
    suggestions: [],
    message: 'Neo4j not configured yet. Connect AuraDB in Phase 4.',
  };
}
