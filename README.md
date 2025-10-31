# Dyno CQL

A TypeScript library for building OGC Common Query Language (CQL) filter expressions with a fluent, type-safe API.

[![npm version](https://img.shields.io/npm/v/dyno-cql.svg?style=flat-square)](https://www.npmjs.com/package/dyno-cql)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Operator Types](#operator-types)
  - [Comparison Operators](#comparison-operators)
  - [Text Operators](#text-operators)
  - [Logical Operators](#logical-operators)
  - [Spatial Operators](#spatial-operators)
- [URL-Safe CQL Strings](#url-safe-cql-strings)
- [Reusable & Prebuilt Conditions](#reusable--prebuilt-conditions)
- [Cloning Queries](#cloning-queries)
- [Error Handling](#error-handling)
- [License](#license)

## Features

- 🔒 **Type-safe API** with full TypeScript support
- 🔗 **Fluent interface** for building complex queries
- 🌐 **Spatial operations** for geospatial filtering (intersects, within, etc.)
- 📝 **Text operations** for string matching (like, contains)
- 🧮 **Comparison operators** (equals, greater than, between, etc.)
- 🔄 **Logical operators** (and, or, not)
- 🔄 **Easy conversion** to CQL strings and URL-safe formats

## Installation

```bash
npm install dyno-cql
```

or

```bash
yarn add dyno-cql
```

## Basic Usage

```typescript
import { QueryBuilder, queryBuilder, eq, gt, and, contains } from 'dyno-cql';

// Using the QueryBuilder class
const query = new QueryBuilder()
  .filter(eq("status", "ACTIVE"))
  .toCQL();
// Result: "status = 'ACTIVE'"

// Using the queryBuilder factory function (no 'new' keyword needed)
const query2 = queryBuilder()
  .filter(eq("status", "ACTIVE"))
  .toCQL();
// Result: "status = 'ACTIVE'"

// Complex filter with method chaining
const complexQuery = queryBuilder()
  .filter(
    and(
      eq("status", "ACTIVE"),
      gt("age", 18),
      contains("description", "important")
    )
  )
  .toCQL();
// Result: "(status = 'ACTIVE' AND age > 18 AND description LIKE '%important%')"
```

> **Tip:** The `queryBuilder()` factory function provides a more convenient API without requiring the `new` keyword. Both approaches are functionally equivalent.

## Operator Types

### Comparison Operators

```typescript
import {
  eq, ne, lt, lte, gt, gte,
  between, isNull, isNotNull
} from 'dyno-cql';

eq("status", "ACTIVE");       // status = 'ACTIVE'
ne("status", "DELETED");      // status <> 'DELETED'
lt("age", 18);               // age < 18
lte("score", 100);           // score <= 100
gt("price", 50);             // price > 50
gte("quantity", 5);          // quantity >= 5
between("age", 18, 65);      // age BETWEEN 18 AND 65
isNull("deletedAt");         // deletedAt = NULL
isNotNull("email");          // email <> NULL
```

### Text Operators

```typescript
import { like, contains } from 'dyno-cql';

like("name", "A");           // name LIKE 'A%'
contains("description", "important");  // description LIKE '%important%'
```

### Logical Operators

```typescript
import { and, or, not, eq, gt } from 'dyno-cql';

and(
  eq("status", "ACTIVE"),
  gt("age", 18)
);  // (status = 'ACTIVE' AND age > 18)

or(
  eq("status", "PENDING"),
  eq("status", "PROCESSING")
);  // (status = 'PENDING' OR status = 'PROCESSING')

not(eq("status", "DELETED"));  // NOT (status = 'DELETED')
```

### Spatial Operators

Spatial operators use GeoJSON for input but convert to Well-Known Text (WKT) format in the generated CQL strings.

```typescript
import {
  intersects, disjoint, spatialContains, within,
  touches, overlaps, crosses, spatialEquals
} from 'dyno-cql';

// GeoJSON Point
const point = {
  type: "Point",
  coordinates: [0, 0]
};

// GeoJSON Polygon
const polygon = {
  type: "Polygon",
  coordinates: [
    [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]
  ]
};

// GeoJSON LineString
const lineString = {
  type: "LineString",
  coordinates: [[0, 0], [1, 1]]
};

intersects("geometry", point);      // INTERSECTS(geometry, POINT(0 0))
disjoint("geometry", point);        // DISJOINT(geometry, POINT(0 0))
spatialContains("geometry", point);  // CONTAINS(geometry, POINT(0 0))
within("geometry", polygon);        // WITHIN(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
touches("geometry", lineString);    // TOUCHES(geometry, LINESTRING(0 0, 1 1))
overlaps("geometry", polygon);      // OVERLAPS(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
crosses("geometry", lineString);    // CROSSES(geometry, LINESTRING(0 0, 1 1))
spatialEquals("geometry", point);    // EQUALS(geometry, POINT(0 0))
```

## URL-Safe CQL Strings

You can generate URL-safe CQL strings for use in URL parameters:

```typescript
import { QueryBuilder, eq, contains, and } from 'dyno-cql';

const query = new QueryBuilder()
  .filter(
    and(
      eq("name", "John & Jane"),
      contains("description", "100% satisfaction")
    )
  );

const urlSafeCQL = query.toCQLUrlSafe();
// Automatically URL-encoded for safe use in URL parameters
```

## Reusable & Prebuilt Conditions

You can create conditions separately and reuse them across multiple queries:

```typescript
import { QueryBuilder, eq, and, gt, ne } from 'dyno-cql';

// Create prebuilt conditions
const activeCondition = eq("status", "ACTIVE");
const adultCondition = gt("age", 18);
const notDeletedCondition = ne("deleted", true);

// Use in a single query
const query = new QueryBuilder()
  .filter(and(activeCondition, adultCondition))
  .toCQL();

// Reuse conditions in different queries
const standardFilters = and(activeCondition, notDeletedCondition);

const query1 = new QueryBuilder()
  .filter(standardFilters)
  .toCQL();

const query2 = new QueryBuilder()
  .filter(and(standardFilters, eq("type", "premium")))
  .toCQL();
```

This approach is useful for:
- **Sharing common filters** across multiple queries
- **Building dynamic queries** by composing conditions conditionally
- **Testing and debugging** specific conditions in isolation
- **Maintaining consistency** in filter logic across your application

## Cloning Queries

You can create a base query and then clone it to make variations:

```typescript
import { QueryBuilder, eq, and } from 'dyno-cql';

// Create a base query
const baseQuery = new QueryBuilder()
  .filter(eq("type", "product"));

// Clone for active products
const activeProductsQuery = baseQuery.clone()
  .filter(and(eq("type", "product"), eq("status", "ACTIVE")));
```

## Error Handling

The library provides specific error types for different scenarios:

```typescript
import { QueryBuilder, eq, CQLError, InvalidConditionError, UnsupportedConditionTypeError } from 'dyno-cql';

try {
  // Your code that might throw CQL errors
  const query = new QueryBuilder()
    .filter(eq("status", undefined))
    .toCQL();
} catch (error) {
  if (error instanceof InvalidConditionError) {
    console.error(`Invalid condition: ${error.message}`);
    console.error(`Missing attribute: ${error.missingAttribute}`);
  } else if (error instanceof UnsupportedConditionTypeError) {
    console.error(`Unsupported condition type: ${error.conditionType}`);
  } else if (error instanceof CQLError) {
    console.error(`General CQL error: ${error.message}`);
  }
}
```

## License

MIT
