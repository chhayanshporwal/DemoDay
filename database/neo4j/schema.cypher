// ==========================================
// DemoDay: Neo4j Graph Schema
// Document 2, Section 2 — The Network
// Execute in Neo4j AuraDB Browser
// ==========================================

// ==========================================
// 1. CONSTRAINTS (Uniqueness & Existence)
// ==========================================

// Ensure each User node has a unique id
CREATE CONSTRAINT user_id_unique IF NOT EXISTS
FOR (u:User) REQUIRE u.id IS UNIQUE;

// Ensure each Skill node has a unique name
CREATE CONSTRAINT skill_name_unique IF NOT EXISTS
FOR (s:Skill) REQUIRE s.name IS UNIQUE;

// Ensure each Institution node has a unique name
CREATE CONSTRAINT institution_name_unique IF NOT EXISTS
FOR (i:Institution) REQUIRE i.name IS UNIQUE;

// ==========================================
// 2. INDEXES (Performance)
// ==========================================

// Index on User role for filtered queries
CREATE INDEX user_role_index IF NOT EXISTS
FOR (u:User) ON (u.role);

// Index on User open_to_work for recruiter discover
CREATE INDEX user_open_to_work_index IF NOT EXISTS
FOR (u:User) ON (u.open_to_work);

// Index on Skill category for grouped filtering
CREATE INDEX skill_category_index IF NOT EXISTS
FOR (s:Skill) ON (s.category);

// ==========================================
// 3. RELATIONSHIP PATTERNS
// ==========================================

// Social Connections
// (:User)-[:FOLLOWS]->(:User)
// (:User)-[:CONNECTED_WITH {status: "accepted", created_at: timestamp()}]-(:User)

// Talent Mapping (For Recruiter Discover Grid)
// (:User)-[:HAS_SKILL {proficiency: "advanced"}]->(:Skill)
// (:User)-[:STUDIED_AT {degree: "B.Tech CSE"}]->(:Institution)

// ==========================================
// 4. EXAMPLE SEED DATA
// ==========================================

// Seed common skill nodes
MERGE (s1:Skill {name: 'React', category: 'frontend'})
MERGE (s2:Skill {name: 'React Native', category: 'mobile'})
MERGE (s3:Skill {name: 'Node.js', category: 'backend'})
MERGE (s4:Skill {name: 'Express', category: 'backend'})
MERGE (s5:Skill {name: 'TypeScript', category: 'language'})
MERGE (s6:Skill {name: 'Python', category: 'language'})
MERGE (s7:Skill {name: 'PostgreSQL', category: 'database'})
MERGE (s8:Skill {name: 'MongoDB', category: 'database'})
MERGE (s9:Skill {name: 'Docker', category: 'devops'})
MERGE (s10:Skill {name: 'AWS', category: 'cloud'})
MERGE (s11:Skill {name: 'FFmpeg', category: 'media'})
MERGE (s12:Skill {name: 'GraphQL', category: 'api'})
MERGE (s13:Skill {name: 'Next.js', category: 'frontend'})
MERGE (s14:Skill {name: 'Flutter', category: 'mobile'})
MERGE (s15:Skill {name: 'Figma', category: 'design'});

// ==========================================
// 5. EXAMPLE QUERIES (For IDE Reference)
// ==========================================

// Find candidates for a recruiter — creators who know Node.js, ordered by mutual connections
// MATCH (recruiter:User {id: $req_id})-[:CONNECTED_WITH*1..2]-(mutual)-[:CONNECTED_WITH]-(candidate:User {role: 'creator', open_to_work: true})
// MATCH (candidate)-[:HAS_SKILL]->(s:Skill {name: 'Node.js'})
// RETURN DISTINCT candidate.id, count(mutual) as mutual_connections
// ORDER BY mutual_connections DESC

// Get all skills for a user
// MATCH (u:User {id: $user_id})-[:HAS_SKILL]->(s:Skill)
// RETURN s.name, s.category

// Find 2nd-degree connections with shared skills
// MATCH (me:User {id: $user_id})-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(suggested:User)
// WHERE me <> suggested AND NOT (me)-[:CONNECTED_WITH]-(suggested)
// RETURN DISTINCT suggested.id, collect(s.name) as shared_skills, count(s) as skill_overlap
// ORDER BY skill_overlap DESC
// LIMIT 20
