# Database Debugging Patterns

## RLS (Row Level Security) Issues

### Symptom: Error 42501 - RLS Policy Violation

**Common causes**:
1. `auth.uid()` returns NULL in policy context
2. Session not passed to database client
3. Policy logic has bugs
4. Using wrong client type

**Debug steps**:
```typescript
// 1. Log user ID from application
const { data: { user } } = await supabase.auth.getUser();
console.log('App user ID:', user?.id);

// 2. Test with admin client to isolate RLS
const adminClient = createAdminClient();
const result = await adminClient.from('table').insert(data);
// If this works, RLS is the issue

// 3. Check policy in database
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

**Solutions**:
- Use `(SELECT auth.uid())` instead of `auth.uid()` in policies
- Specify `TO authenticated` in policy
- Add `IS NOT NULL` checks
- Use admin client for operations that need to bypass RLS

### Symptom: Data Inserted but Becomes NULL

**Common cause**: BEFORE INSERT trigger overwrites values

**Debug steps**:
```sql
-- Check for triggers
SELECT * FROM pg_trigger WHERE tgrelid = 'table_name'::regclass;

-- Check trigger function
\df+ function_name
```

**Solution**: Remove or fix trigger that overwrites values

## Migration Issues

### Symptom: Migration Applied but Changes Not Reflected

**Causes**:
- Migration order wrong
- Later migration overwrites earlier one
- Database not reset after migration

**Debug steps**:
```bash
# Check applied migrations
npx supabase migration list

# Reset database to apply all migrations
npx supabase db reset
```

### Symptom: Migration Fails with Dependency Error

**Cause**: Trying to drop/modify object that other objects depend on

**Solution**:
```sql
-- Drop dependent objects first
DROP POLICY IF EXISTS dependent_policy ON table;
DROP TRIGGER IF EXISTS dependent_trigger ON table;
-- Then drop/modify the object
```

## Query Performance Issues

### Symptom: Slow Queries

**Debug steps**:
```sql
-- Check query plan
EXPLAIN ANALYZE
SELECT * FROM table WHERE condition;

-- Look for:
-- - Seq Scan (bad) vs Index Scan (good)
-- - High cost numbers
-- - Many rows scanned
```

**Solutions**:
- Add indexes on frequently queried columns
- Add composite indexes for multi-column queries
- Use partial indexes for filtered queries

## Connection Issues

### Symptom: Connection Refused

**Checks**:
- Is database running? `npx supabase status`
- Correct connection string?
- Firewall blocking connection?
- Connection pool exhausted?

## Type Mismatch Issues

### Symptom: Data Looks Correct but Insert Fails

**Debug**:
```typescript
// Log actual types
console.log('Type:', typeof value);
console.log('Value:', JSON.stringify(value, null, 2));

// Check schema
// UUID vs string
// TIMESTAMPTZ vs string
// JSONB vs object
```
