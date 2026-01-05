# Dyno CQL

Build type-safe OGC Common Query Language (CQL) filter expressions with a fluent TypeScript API.

[![npm version](https://img.shields.io/npm/v/dyno-cql.svg?style=flat-square)](https://www.npmjs.com/package/dyno-cql)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## Why Dyno CQL?

Working with geospatial and temporal data shouldn't mean wrestling with raw CQL strings. Dyno CQL gives you:

- **Full TypeScript support** - Catch errors at compile time, not runtime
- **Fluent chaining** - Build complex filters that read like sentences
- **Zero string concatenation** - No more manual escaping or formatting
- **OGC CQL2 compliant** - Works with modern geospatial APIs

## Installation

```bash
npm install dyno-cql
```

## Quick Start

```typescript
import { queryBuilder, eq, gt, and } from 'dyno-cql';

// Simple filter
const simple = queryBuilder()
  .filter(eq("status", "ACTIVE"))
  .toCQL();
// → status = 'ACTIVE'

// Complex filter
const complex = queryBuilder()
  .filter(
    and(
      eq("status", "ACTIVE"),
      gt("age", 18)
    )
  )
  .toCQL();
// → (status = 'ACTIVE' AND age > 18)
```

## Comparison Operators

Standard value comparisons for filtering your data.

```typescript
import { eq, ne, lt, lte, gt, gte, between, isNull, isNotNull } from 'dyno-cql';

// Equality
eq("status", "ACTIVE")        // → status = 'ACTIVE'
ne("status", "DELETED")       // → status <> 'DELETED'

// Numeric comparisons
lt("age", 18)                 // → age < 18
lte("score", 100)             // → score <= 100
gt("price", 50)               // → price > 50
gte("quantity", 5)            // → quantity >= 5

// Range queries
between("age", 18, 65)        // → age BETWEEN 18 AND 65

// Null checks
isNull("deletedAt")           // → deletedAt IS NULL
isNotNull("email")            // → email IS NOT NULL
```

### Real-world example

```typescript
import { queryBuilder, and, gte, lte, ne } from 'dyno-cql';

// Find products in stock within a price range
const query = queryBuilder()
  .filter(
    and(
      gte("price", 10),
      lte("price", 100),
      ne("stock", 0)
    )
  )
  .toCQL();
// → (price >= 10 AND price <= 100 AND stock <> 0)
```

## Text Operators

String matching for search functionality.

```typescript
import { like, contains } from 'dyno-cql';

// Prefix matching
like("name", "A")                    // → name LIKE 'A%'

// Substring search
contains("description", "important")  // → description LIKE '%important%'
```

### Real-world example

```typescript
import { queryBuilder, and, contains, eq } from 'dyno-cql';

// Search active blog posts
const query = queryBuilder()
  .filter(
    and(
      contains("title", "TypeScript"),
      eq("published", true)
    )
  )
  .toCQL();
// → (title LIKE '%TypeScript%' AND published = true)
```

## Logical Operators

Combine multiple conditions to build complex filters.

```typescript
import { and, or, not, eq, gt } from 'dyno-cql';

// AND - all conditions must match
and(
  eq("status", "ACTIVE"),
  gt("age", 18)
)
// → (status = 'ACTIVE' AND age > 18)

// OR - any condition can match
or(
  eq("status", "PENDING"),
  eq("status", "PROCESSING")
)
// → (status = 'PENDING' OR status = 'PROCESSING')

// NOT - negate a condition
not(eq("status", "DELETED"))
// → NOT (status = 'DELETED')
```

### Real-world example

```typescript
import { queryBuilder, and, or, eq, gte } from 'dyno-cql';

// Find premium or high-value active customers
const query = queryBuilder()
  .filter(
    and(
      eq("status", "ACTIVE"),
      or(
        eq("tier", "PREMIUM"),
        gte("lifetimeValue", 10000)
      )
    )
  )
  .toCQL();
// → (status = 'ACTIVE' AND (tier = 'PREMIUM' OR lifetimeValue >= 10000))
```

## Spatial Operators

Filter geospatial data using GeoJSON geometries. Input uses GeoJSON, output converts to WKT (Well-Known Text) format.

```typescript
import {
  intersects,
  disjoint,
  spatialContains,
  within,
  touches,
  overlaps,
  crosses,
  spatialEquals
} from 'dyno-cql';

// Point geometry
const point = { type: "Point", coordinates: [0, 0] };
intersects("geometry", point)
// → INTERSECTS(geometry, POINT(0 0))

// Polygon geometry
const polygon = {
  type: "Polygon",
  coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
};
within("geometry", polygon)
// → WITHIN(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))

// Line geometry
const line = {
  type: "LineString",
  coordinates: [[0, 0], [1, 1]]
};
crosses("geometry", line)
// → CROSSES(geometry, LINESTRING(0 0, 1 1))
```

### Available spatial operators

| Operator | Description |
|----------|-------------|
| `intersects` | Geometries share any space |
| `disjoint` | Geometries share no space |
| `spatialContains` | First geometry contains the second |
| `within` | First geometry is within the second |
| `touches` | Geometries touch at boundary only |
| `overlaps` | Geometries overlap but neither contains the other |
| `crosses` | Geometries cross each other |
| `spatialEquals` | Geometries are spatially equal |

### Real-world example

```typescript
import { queryBuilder, and, intersects, eq } from 'dyno-cql';

// Find available properties in a bounding box
const searchArea = {
  type: "Polygon",
  coordinates: [[
    [-122.5, 37.7],
    [-122.3, 37.7],
    [-122.3, 37.9],
    [-122.5, 37.9],
    [-122.5, 37.7]
  ]]
};

const query = queryBuilder()
  .filter(
    and(
      intersects("location", searchArea),
      eq("available", true)
    )
  )
  .toCQL();
```

## Temporal Operators

Filter data by time and date relationships. Supports ISO 8601 timestamps, Date objects, and intervals.

### Simple temporal filtering

```typescript
import { anyinteracts } from 'dyno-cql';

// Match a specific timestamp
anyinteracts("eventDate", "2023-01-01T00:00:00Z")
// → ANYINTERACTS(eventDate, TIMESTAMP('2023-01-01T00:00:00Z'))

// Match a time interval
anyinteracts("eventDate", { start: "2023-01-01", end: "2023-12-31" })
// → ANYINTERACTS(eventDate, INTERVAL('2023-01-01', '2023-12-31'))
```

### Point-in-time operators

```typescript
import { after, before, tequals } from 'dyno-cql';

// After a timestamp
after("eventDate", "2023-01-01T00:00:00Z")
// → AFTER(eventDate, TIMESTAMP('2023-01-01T00:00:00Z'))

// Before a timestamp
before("eventDate", "2023-12-31T23:59:59Z")
// → BEFORE(eventDate, TIMESTAMP('2023-12-31T23:59:59Z'))

// Equal to a timestamp
tequals("eventDate", "2023-06-15T12:00:00Z")
// → TEQUALS(eventDate, TIMESTAMP('2023-06-15T12:00:00Z'))

// Works with Date objects too
const date = new Date("2023-06-15");
after("eventDate", date)
// → AFTER(eventDate, TIMESTAMP('2023-06-15T00:00:00.000Z'))
```

### Interval operators

```typescript
import { during, toverlaps, overlappedby, tcontains } from 'dyno-cql';

// Event occurs during an interval
during("eventDate", { start: "2023-01-01", end: "2023-12-31" })
// → DURING(eventDate, INTERVAL('2023-01-01', '2023-12-31'))

// Event period overlaps an interval
toverlaps("eventPeriod", { start: "2023-06-01", end: "2023-12-31" })
// → TOVERLAPS(eventPeriod, INTERVAL('2023-06-01', '2023-12-31'))

// Event period is overlapped by an interval
overlappedby("eventPeriod", { start: "2022-06-01", end: "2023-06-30" })
// → OVERLAPPEDBY(eventPeriod, INTERVAL('2022-06-01', '2023-06-30'))

// Event period contains a timestamp
tcontains("eventPeriod", "2023-06-15T12:00:00Z")
// → TCONTAINS(eventPeriod, TIMESTAMP('2023-06-15T12:00:00Z'))
```

### Boundary operators

```typescript
import { begins, begunby, ends, endedby, meets, metby, tintersects } from 'dyno-cql';

// Period begins at timestamp
begins("eventPeriod", "2023-01-01T00:00:00Z")
// → BEGINS(eventPeriod, TIMESTAMP('2023-01-01T00:00:00Z'))

// Period is begun by timestamp
begunby("eventPeriod", "2023-01-01T00:00:00Z")
// → BEGUNBY(eventPeriod, TIMESTAMP('2023-01-01T00:00:00Z'))

// Period ends at timestamp
ends("eventPeriod", "2023-12-31T23:59:59Z")
// → ENDS(eventPeriod, TIMESTAMP('2023-12-31T23:59:59Z'))

// Period is ended by timestamp
endedby("eventPeriod", "2023-12-31T23:59:59Z")
// → ENDEDBY(eventPeriod, TIMESTAMP('2023-12-31T23:59:59Z'))

// Periods meet (one ends when other begins)
meets("eventPeriod", { start: "2023-07-01", end: "2023-12-31" })
// → MEETS(eventPeriod, INTERVAL('2023-07-01', '2023-12-31'))

// Periods are met by (other ends when one begins)
metby("eventPeriod", { start: "2022-07-01", end: "2023-01-01" })
// → METBY(eventPeriod, INTERVAL('2022-07-01', '2023-01-01'))

// Temporal intersection
tintersects("eventDate", "2023-06-15T12:00:00Z")
// → TINTERSECTS(eventDate, TIMESTAMP('2023-06-15T12:00:00Z'))
```

### Real-world example

```typescript
import { queryBuilder, and, after, before, eq } from 'dyno-cql';

// Find active events in Q2 2023
const query = queryBuilder()
  .filter(
    and(
      after("startDate", "2023-04-01T00:00:00Z"),
      before("endDate", "2023-06-30T23:59:59Z"),
      eq("status", "ACTIVE")
    )
  )
  .toCQL();
```

## Advanced Usage

### Reusable conditions

Build conditions once, use them everywhere.

```typescript
import { queryBuilder, eq, and, gt, ne } from 'dyno-cql';

// Define reusable conditions
const isActive = eq("status", "ACTIVE");
const isAdult = gt("age", 18);
const notDeleted = ne("deleted", true);

// Combine them
const standardFilters = and(isActive, notDeleted);

// Use in multiple queries
const query1 = queryBuilder()
  .filter(and(standardFilters, eq("type", "premium")))
  .toCQL();

const query2 = queryBuilder()
  .filter(and(standardFilters, isAdult))
  .toCQL();
```

### Clone and modify queries

Start with a base query and create variations.

```typescript
import { queryBuilder, eq, and } from 'dyno-cql';

// Base query
const baseQuery = queryBuilder()
  .filter(eq("type", "product"));

// Create variations
const activeProducts = baseQuery.clone()
  .filter(and(eq("type", "product"), eq("status", "ACTIVE")));

const archivedProducts = baseQuery.clone()
  .filter(and(eq("type", "product"), eq("archived", true)));
```

### URL-safe output

Generate encoded strings ready for URL parameters.

```typescript
import { queryBuilder, and, eq, contains } from 'dyno-cql';

const query = queryBuilder()
  .filter(
    and(
      eq("name", "John & Jane"),
      contains("description", "100% satisfaction")
    )
  )
  .toCQLUrlSafe();

// Use directly in fetch
fetch(`/api/products?filter=${query}`);
```

## Error Handling

Dyno CQL provides specific error types to help you debug issues.

```typescript
import {
  queryBuilder,
  eq,
  CQLError,
  InvalidConditionError,
  UnsupportedConditionTypeError
} from 'dyno-cql';

try {
  const query = queryBuilder()
    .filter(eq("status", undefined))
    .toCQL();
} catch (error) {
  if (error instanceof InvalidConditionError) {
    console.error('Invalid condition:', error.message);
    console.error('Missing:', error.missingAttribute);
  } else if (error instanceof UnsupportedConditionTypeError) {
    console.error('Unsupported type:', error.conditionType);
  } else if (error instanceof CQLError) {
    console.error('CQL error:', error.message);
  }
}
```

## API Reference

### Comparison Operators
- `eq(attr, value)` - Equal to
- `ne(attr, value)` - Not equal to
- `lt(attr, value)` - Less than
- `lte(attr, value)` - Less than or equal to
- `gt(attr, value)` - Greater than
- `gte(attr, value)` - Greater than or equal to
- `between(attr, min, max)` - Between two values
- `isNull(attr)` - Is null
- `isNotNull(attr)` - Is not null

### Text Operators
- `like(attr, value)` - Prefix match (value%)
- `contains(attr, value)` - Substring match (%value%)

### Logical Operators
- `and(...conditions)` - All conditions must match
- `or(...conditions)` - Any condition must match
- `not(condition)` - Negate a condition

### Spatial Operators
- `intersects(attr, geometry)` - Geometries intersect
- `disjoint(attr, geometry)` - Geometries are disjoint
- `spatialContains(attr, geometry)` - Contains geometry
- `within(attr, geometry)` - Within geometry
- `touches(attr, geometry)` - Touches geometry
- `overlaps(attr, geometry)` - Overlaps geometry
- `crosses(attr, geometry)` - Crosses geometry
- `spatialEquals(attr, geometry)` - Spatially equal

### Temporal Operators

**Simple CQL:**
- `anyinteracts(attr, temporal)` - Any temporal interaction

**Enhanced operators:**
- `after(attr, timestamp)` - After timestamp
- `before(attr, timestamp)` - Before timestamp
- `tequals(attr, timestamp)` - Temporally equal
- `during(attr, interval)` - During interval
- `toverlaps(attr, interval)` - Overlaps interval
- `overlappedby(attr, interval)` - Overlapped by interval
- `tcontains(attr, temporal)` - Contains temporal
- `begins(attr, timestamp)` - Begins at timestamp
- `begunby(attr, timestamp)` - Begun by timestamp
- `ends(attr, timestamp)` - Ends at timestamp
- `endedby(attr, timestamp)` - Ended by timestamp
- `meets(attr, interval)` - Meets interval
- `metby(attr, interval)` - Met by interval
- `tintersects(attr, temporal)` - Temporally intersects

## License

MIT
