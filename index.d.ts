import type { PawaGraph } from 'pawajs';

/** Serialized hydration node emitted by Pawajs/pawa-ssr. */
export interface HydrationNode {
  id: string;
  type: 'state' | 'condition' | 'template' | 'for' | 'key' | 'await' | 'component' | 'for-key' | (string & {});
  children?: HydrationChild[];
  ref?: string;
  [key: string]: unknown;
}

export type HydrationChild = HydrationNode | string | number;

/** Root object contained in the serialized hydration JSON. */
export interface HydrationTree {
  id?: string;
  children?: HydrationChild[];
  [key: string]: unknown;
}

/** Pawajs runtime graph used while resuming a hydration node. */
export type RenderGraph = PawaGraph;

/** Resume one serialized node against its existing DOM and Pawajs graph. */
export declare function resumer(
  hydrate: HydrationNode,
  graph: PawaGraph,
  context: Record<string, unknown>,
): void | false;

/** Parse serialized hydration data and resume the rendered application. */
export declare function PawaContinue(json: string): void;
