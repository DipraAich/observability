/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CUSTOM_LABEL } from '../../../../common/constants/explorer';
import { PPLNode } from '../node';

export class Span extends PPLNode {
  constructor(
    name: string,
    children: Array<PPLNode>,
    private spanExpression: PPLNode,
    private customLabel: string
  ) {
    super(name, children);
  }

  getTokens() {
    return {
      span_expression: this.spanExpression.getTokens(),
      [CUSTOM_LABEL]: this[CUSTOM_LABEL],
    };
  }

  toString(): string {
    return `${this.spanExpression.toString()}${
      this[CUSTOM_LABEL] ? ` as ${this[CUSTOM_LABEL]}` : ''
    }`;
  }
}
