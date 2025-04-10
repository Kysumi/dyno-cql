import { eq } from "../src/operators/comparison-operators";
import { and } from "../src/operators/logical-operators";
import { contains } from "../src/operators/text-operators";
import { QueryBuilder } from "../src/query-builder";

const hah = and(
  eq("name", "John & Jane"),
  contains("description", "100% satisfaction"),
);

// Create a query with special characters that need encoding
const query = new QueryBuilder().filter(hah);

try {
  // Get the CQL string and URL-safe version
  console.log("Getting CQL string...");
  const cqlString = query.toCQL();
  console.log("Got CQL string:", cqlString);

  console.log("Getting URL-safe CQL...");
  const urlSafeCQL = query.toCQLUrlSafe();
  console.log("Got URL-safe CQL:", urlSafeCQL);

  console.log("Original CQL:", cqlString);
  console.log("URL-safe CQL:", urlSafeCQL);
  console.log("Decoded URL-safe CQL:", decodeURIComponent(urlSafeCQL));
  console.log("Match original?", decodeURIComponent(urlSafeCQL) === cqlString);
} catch (error) {
  console.error("Error:", error);
}
