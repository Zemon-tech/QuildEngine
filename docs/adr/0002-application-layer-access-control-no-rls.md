# Application-Layer Access Control, No RLS

We enforce access control in application service code (filtering by `user_id`, checking `req.user.role`) rather than using Supabase Row Level Security policies.

RLS is powerful but introduces a second location where authorization logic lives — one in Postgres policies, one in application code. This makes reasoning about "who can see what" harder, especially during development. With a single admin client (secret key) that bypasses RLS, all access decisions are explicit in service methods, visible in code review, and testable with unit tests. The tradeoff is that a bug in service code could expose data (RLS would catch it at the DB layer), but we accept this risk at current scale in exchange for simpler debugging, testing, and faster iteration. If the team grows or the attack surface expands, RLS can be layered on without code changes — it's additive.
