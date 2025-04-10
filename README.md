# Dyno CQL

A TypeScript library for building OGC Common Query Language (CQL) filter expressions with a fluent, type-safe API.

[![npm version](https://img.shields.io/npm/v/dyno-table.svg?style=flat-square)](https://www.npmjs.com/package/dyno-cql)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## Overview

Dyno CQL provides a simple and intuitive way to construct CQL filter expressions for querying geospatial and other data sources. It supports a wide range of operators including comparison, logical, text, and spatial operations, all with proper TypeScript typing.

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
import { QueryBuilder } from 'dyno-cql';
import { eq, gt, and, contains } from 'dyno-cql/operators';

// Simple filter
const query = new QueryBuilder()
  .filter(eq("status", "ACTIVE"))
  .toCQL();
// Result: "status = 'ACTIVE'"

// Complex filter
const complexQuery = new QueryBuilder()
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

## Operator Types

### Comparison Operators

```typescript
import {
  eq, ne, lt, lte, gt, gte,
  between, isNull, isNotNull
} from 'dyno-cql/operators';

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
import { like, contains } from 'dyno-cql/operators';

like("name", "A");           // name LIKE 'A%'
contains("description", "important");  // description LIKE '%important%'
```

### Logical Operators

```typescript
import { and, or, not } from 'dyno-cql/operators';
import { eq, gt } from 'dyno-cql/operators';

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
} from 'dyno-cql/operators';

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
import { QueryBuilder } from 'dyno-cql';
import { eq, contains, and } from 'dyno-cql/operators';

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

## Cloning Queries

You can create a base query and then clone it to make variations:

```typescript
import { QueryBuilder } from 'dyno-cql';
import { eq, and } from 'dyno-cql/operators';

// Create a base query
const baseQuery = new QueryBuilder()
  .filter(eq("type", "product"));

// Clone for active products
const activeProductsQuery = baseQuery.clone()
  .filter(and(baseQuery.getFilter(), eq("status", "ACTIVE")));
```

## Error Handling

The library provides specific error types for different scenarios:

```typescript
import { CQLError, InvalidConditionError, UnsupportedConditionTypeError } from 'dyno-cql/errors';

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
