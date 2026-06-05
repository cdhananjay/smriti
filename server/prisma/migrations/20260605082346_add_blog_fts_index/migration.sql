CREATE INDEX IF NOT EXISTS "Blog_search_idx" ON "Blog"
USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));