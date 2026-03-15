---
name: systematic-debugging
description: Systematic approach to debugging and problem-solving for any type of bug (backend, frontend, database, RLS, authentication, etc.). Use when encountering errors, bugs, or unexpected behavior that needs investigation. Provides structured methodology to identify root causes quickly through logging, verification, and systematic elimination rather than guessing.
license: MIT
---

# Systematic Debugging & Problem Solving

A battle-tested methodology for debugging any type of issue efficiently. Based on real debugging experience fixing complex RLS policy bugs, authentication issues, and database constraints.

## Core Principles

### 1. Never Guess - Always Verify

**BAD**: "Maybe it's the RLS policy" → Try random fixes
**GOOD**: Add logging → See actual values → Identify real issue

### 2. Add Logging First

Before attempting any fix, add comprehensive logging to see what's actually happening.

```typescript
// Add detailed logs at key points
console.log('[ServiceName.method] Input:', input);
console.log('[ServiceName.method] User ID:', user?.id);
console.log('[ServiceName.method] Data to insert:', data);
console.log('[ServiceName.method] Error:', error);
console.log('[ServiceName.method] Success:', result);
```

### 3. Follow the Data Flow

Trace data from source to destination:
1. Where does it start? (User input, session, etc.)
2. What transforms it? (Functions, triggers, policies)
3. Where does it fail? (Exact point of error)
4. What's the actual vs expected value?

### 4. Check the Obvious First

Before diving deep:
- Is the service running?
- Are environment variables set?
- Is the database migrated?
- Are dependencies installed?
- Is the user authenticated?

### 5. Systematic Elimination

Test one hypothesis at a time:
1. Identify possible causes
2. Test each systematically
3. Eliminate confirmed non-causes
4. Focus on remaining possibilities

## Debugging Workflow

### Step 1: Reproduce the Issue

**Goal**: Consistently trigger the bug

**Actions**:
- Document exact steps to reproduce
- Note any error messages (full text, error codes)
- Check if it happens every time or intermittently
- Test in different environments (dev, staging, prod)

**Output**: Clear reproduction steps + error details

### Step 2: Add Comprehensive Logging

**Goal**: See what's actually happening

**Where to add logs**:
- Function entry points (inputs)
- Before database operations (data being sent)
- After database operations (results or errors)
- Before/after external API calls
- Authentication/authorization checks
- Data transformations

**Example**:
```typescript
static async create(data: Input) {
  console.log('[Service.create] START');
  console.log('[Service.create] Input:', JSON.stringify(data, null, 2));
  
  const user = await getUser();
  console.log('[Service.create] User:', user?.id);
  
  const result = await db.insert(data);
  console.log('[Service.create] Result:', result);
  console.log('[Service.create] END');
  
  return result;
}
```

### Step 3: Analyze the Logs

**Goal**: Identify where actual != expected

**Questions to ask**:
- What values are NULL that shouldn't be?
- What values are different than expected?
- Where does the flow diverge from expected?
- Are there any unexpected function calls?
- Are there any missing function calls?

**Pattern recognition**:
- NULL values → Check source of data
- Wrong values → Check transformations
- Missing data → Check if step was skipped
- Error codes → Look up specific meaning

### Step 4: Form Hypotheses

**Goal**: List possible root causes

**Based on logs, identify**:
- What could cause this specific error?
- What could cause this specific NULL value?
- What could cause this specific behavior?

**Prioritize by**:
- Likelihood (most common causes first)
- Impact (critical issues first)
- Ease of testing (quick tests first)

### Step 5: Test Hypotheses Systematically

**Goal**: Eliminate possibilities one by one

**For each hypothesis**:
1. Make a specific, testable prediction
2. Add targeted logging or tests
3. Run the test
4. Document the result
5. If confirmed → Fix it
6. If eliminated → Move to next hypothesis

**Example**:
```
Hypothesis: RLS policy is blocking INSERT
Prediction: If I bypass RLS, INSERT will succeed
Test: Use admin client (bypasses RLS)
Result: Still fails with different error
Conclusion: RLS is not the root cause
```

### Step 6: Verify the Fix

**Goal**: Confirm issue is resolved

**Verification checklist**:
- [ ] Original error no longer occurs
- [ ] Feature works as expected
- [ ] No new errors introduced
- [ ] Edge cases still work
- [ ] Performance is acceptable

### Step 7: Document the Solution

**Goal**: Help future debugging

**Document**:
- Root cause identified
- Why it happened
- How it was fixed
- How to prevent in future
- Related issues to watch for

## Common Bug Patterns

### Pattern 1: RLS Policy Issues

**Symptoms**:
- Error code 42501
- "violates row-level security policy"
- Works in some contexts but not others

**Debug approach**:
1. Log the user ID from application
2. Check if auth.uid() returns same value in RLS context
3. Verify RLS policy logic
4. Check if using correct client (authenticated vs anon)
5. Test with admin client to isolate RLS vs other issues

**Common causes**:
- auth.uid() returns NULL in certain contexts
- Session not passed correctly to database
- Policy logic has bugs
- Using wrong database client

### Pattern 2: Database Triggers Overwriting Data

**Symptoms**:
- Data inserted correctly but becomes NULL
- Logs show correct value, database has NULL
- Error: "null value violates not-null constraint"

**Debug approach**:
1. Check for BEFORE INSERT triggers
2. Log trigger execution
3. Verify trigger logic
4. Check if trigger uses auth.uid() (may be NULL)

**Common causes**:
- Trigger overwrites application-set values
- Trigger uses auth.uid() which returns NULL
- Trigger has incorrect logic

### Pattern 3: Authentication Context Loss

**Symptoms**:
- User authenticated in app but not in database
- auth.uid() returns NULL
- Session exists but not recognized

**Debug approach**:
1. Log session from application side
2. Check database client configuration
3. Verify cookie/token passing
4. Test with different client types

**Common causes**:
- SSR client not configured correctly
- Cookies not passed to database
- Using wrong client type
- Session expired

### Pattern 4: Type Mismatches

**Symptoms**:
- Data looks correct but operation fails
- Validation passes but database rejects
- Silent failures or unexpected behavior

**Debug approach**:
1. Log actual types (typeof, instanceof)
2. Log actual values (JSON.stringify)
3. Check schema expectations
4. Verify type conversions

**Common causes**:
- String vs number mismatch
- null vs undefined
- Date format issues
- JSON serialization problems

## Debugging Tools & Techniques

### Console Logging

**Structured logging format**:
```typescript
console.log('[Component.method] Label:', value);
```

**Benefits**:
- Easy to grep/search
- Shows execution flow
- Identifies source quickly

### Database Query Logging

**Enable query logging**:
```typescript
// Supabase
const { data, error } = await supabase
  .from('table')
  .insert(data)
  .select();

console.log('Query result:', { data, error });
```

### Error Object Inspection

**Log full error details**:
```typescript
console.error('Error details:', {
  message: error.message,
  code: error.code,
  details: error.details,
  hint: error.hint,
  stack: error.stack
});
```

### Diff Comparison

**Compare expected vs actual**:
```typescript
console.log('Expected:', expected);
console.log('Actual:', actual);
console.log('Diff:', {
  missing: expected.filter(x => !actual.includes(x)),
  extra: actual.filter(x => !expected.includes(x))
});
```

### Isolation Testing

**Test components in isolation**:
1. Remove all other code
2. Test just the failing component
3. Add back code piece by piece
4. Identify what causes failure

### Binary Search Debugging

**For intermittent issues**:
1. Add checkpoint logs throughout code
2. Run until failure
3. Check which checkpoints passed
4. Focus on code between last pass and first fail
5. Repeat until narrowed down

## Anti-Patterns to Avoid

### ❌ Guessing and Trying Random Fixes

**Problem**: Wastes time, may introduce new bugs

**Instead**: Add logging, identify root cause, then fix

### ❌ Changing Multiple Things at Once

**Problem**: Can't tell what fixed it (or broke it)

**Instead**: Change one thing, test, document result

### ❌ Assuming You Know the Cause

**Problem**: Confirmation bias, miss actual cause

**Instead**: Verify with logs and tests

### ❌ Skipping Reproduction Steps

**Problem**: Can't verify fix works

**Instead**: Document exact reproduction steps first

### ❌ Not Documenting the Process

**Problem**: Repeat same debugging next time

**Instead**: Document findings and solution

### ❌ Fixing Symptoms Instead of Root Cause

**Problem**: Bug returns in different form

**Instead**: Identify and fix root cause

## Quick Reference Checklist

When encountering a bug:

- [ ] Can you reproduce it consistently?
- [ ] Have you added logging at key points?
- [ ] Have you checked the logs for actual values?
- [ ] Have you identified where actual != expected?
- [ ] Have you formed specific hypotheses?
- [ ] Have you tested hypotheses systematically?
- [ ] Have you verified the fix works?
- [ ] Have you documented the solution?

## Real-World Example: RLS Policy Bug

**Initial symptom**: "new row violates row-level security policy"

**Debugging process**:
1. Added logging → Saw user.id exists
2. Hypothesis 1: RLS policy syntax wrong → Fixed syntax, still failed
3. Hypothesis 2: auth.uid() returns NULL → Used admin client, different error!
4. New error: "null value in column owner_id" → Data is NULL!
5. Added more logging → owner_id set correctly in code
6. Hypothesis 3: Something overwrites it → Found BEFORE INSERT trigger
7. Trigger uses auth.uid() → Returns NULL with admin client
8. Solution: Remove trigger, let application set owner_id

**Key lessons**:
- Each hypothesis led to new information
- Logs revealed actual vs expected values
- Systematic testing eliminated wrong hypotheses
- Root cause was different than initial assumption

## When to Escalate

Escalate to senior developer or team when:
- Spent >2 hours without progress
- Issue involves unfamiliar technology
- Potential security implications
- Affects production users
- Requires architectural changes

Before escalating, prepare:
- Reproduction steps
- Logs and error messages
- Hypotheses tested and results
- What you've tried so far
