import type { Condition } from "./operators/base-types";

/**
 * Base error class for all CQL related errors
 */
export class CQLError extends Error {
  /**
   * Creates a new CQL error
   * @param message - The error message
   */
  constructor(message: string) {
    super(message);
    this.name = "CQLError";
  }
}

/**
 * Error thrown when a condition is missing required attributes.
 */
export class InvalidConditionError extends CQLError {
  /**
   * Creates a new invalid condition error
   * @param conditionType - The type of the condition
   * @param condition - The condition object that caused the error
   * @param missingAttribute - The name of the missing attribute
   */
  constructor(
    /** The type of the condition */
    public readonly conditionType: string,
    /** The condition object that caused the error */
    public readonly condition: Partial<Condition>,
    /** The name of the missing attribute */
    public readonly missingAttribute: string,
  ) {
    const message = `Condition of type '${conditionType}' is missing required attribute: ${missingAttribute}.`;
    super(message);
    this.name = "InvalidConditionError";
  }
}

/**
 * Error thrown when an unsupported condition type is encountered.
 */
export class UnsupportedConditionTypeError extends CQLError {
  /**
   * Creates a new unsupported condition type error
   * @param conditionType - The unsupported condition type
   * @param condition - The condition object that caused the error
   */
  constructor(
    /** The unsupported type */
    public readonly conditionType: string,
    /** The condition object that caused the error */
    public readonly condition: Partial<Condition>,
  ) {
    const message = `Unsupported condition type: ${conditionType}.`;
    super(message);
    this.name = "UnsupportedConditionTypeError";
  }
}

/**
 * Error thrown when there is an issue with a spatial operation.
 */
export class SpatialOperationError extends CQLError {
  /**
   * Creates a new spatial operation error
   * @param operator - The spatial operator that failed
   * @param condition - The condition object that caused the error
   * @param reason - The specific reason for the failure
   */
  constructor(
    /** The spatial operator that failed */
    public readonly operator: string,
    /** The specific reason for the failure */
    public readonly reason: string,
  ) {
    const message = `Error in spatial operation '${operator}': ${reason}.`;
    super(message);
    this.name = "SpatialOperationError";
  }
}
