/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { PPLNode } from '../node';

export class AggregateTerm extends PPLNode {
  constructor(
    name: string,
    children: Array<PPLNode>,
    private statsFunction: PPLNode,
    private customLabel: string
  ) {
    super(name, children);
  }

  getTokens() {
    return {
      function: this.statsFunction.getTokens(),
      customLabel: this.customLabel,
    };
  }

  toString(): string {
    if (this.customLabel) {
      return `${this.statsFunction.toString()}${this.customLabel ? ` as ${this.customLabel}` : ''}`;
    }
    return `${this.statsFunction.toString()}`;
  }
}
