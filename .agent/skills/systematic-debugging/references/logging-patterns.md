# Effective Logging Patterns

## Structured Logging Format

### Standard Format
```typescript
console.log('[Component.method] Label:', value);
```

**Benefits**:
- Easy to grep: `grep "\[ProjectService.create\]"`
- Shows execution flow
- Identifies source quickly

### Examples

**Service layer**:
```typescript
console.log('[ProjectService.create] START');
console.log('[ProjectService.create] Input:', data);
console.log('[ProjectService.create] User ID:', user.id);
console.log('[ProjectService.create] Result:', result);
console.log('[ProjectService.create] END');
```

**Action layer**:
```typescript
console.log('[createProjectAction] FormData:', Object.fromEntries(formData));
console.log('[createProjectAction] Validation:', validation);
console.log('[createProjectAction] Service result:', result);
```

## What to Log

### Always Log
- Function inputs
- User/session IDs
- Data being sent to database
- Database results or errors
- Function outputs

### Conditionally Log
- Intermediate calculations (if complex)
- Branch decisions (if/else paths taken)
- Loop iterations (if debugging loop issues)

### Never Log
- Passwords or secrets
- Full credit card numbers
- Personal sensitive data (unless necessary and secured)

## Log Levels

### Development
```typescript
console.log()   // General info
console.warn()  // Warnings
console.error() // Errors
```

### Production
Use proper logging library:
```typescript
logger.info()
logger.warn()
logger.error()
```

## Temporary vs Permanent Logs

### Temporary (Debug Logs)
- Add during debugging
- Remove after fix
- Prefix with DEBUG:

```typescript
console.log('DEBUG: Checking value:', value);
```

### Permanent (Monitoring Logs)
- Keep for monitoring
- Use proper log levels
- Include context

```typescript
logger.error('Failed to create project', {
  userId: user.id,
  error: error.message,
  timestamp: new Date()
});
```

## JSON Logging

For complex objects:
```typescript
console.log('Object:', JSON.stringify(obj, null, 2));
```

For circular references:
```typescript
console.log('Object:', util.inspect(obj, { depth: 3 }));
```
