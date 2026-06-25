# Supabase JS Client over an ORM

We use `@supabase/supabase-js` with the secret key (`sb_secret_...`) for all database access instead of an ORM like Drizzle or Prisma.

The Supabase client acts as a thin query builder over PostgREST. This avoids connection pooling management, schema-as-code synchronization, and ORM migration tooling — all of which add complexity when Supabase already provides a managed Postgres instance with its own migration story. The tradeoff is less SQL flexibility for complex queries (joins, CTEs, transactions), but at current scale the PostgREST layer handles our access patterns. If complex queries become frequent, we can add direct Postgres access via `pg` or Drizzle for specific modules without rewriting the entire data layer.
