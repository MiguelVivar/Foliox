declare module "react-grid-layout" {
  import React from "react";

  export interface Layout {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
    static?: boolean;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    moved?: boolean;
    static_?: boolean;
  }

  export interface Layouts {
    [key: string]: Layout[];
  }

  export interface GridLayoutProps {
    className?: string;
    layout?: Layout[];
    layouts?: Layouts;
    cols?: number | number[];
    rowHeight?: number;
    maxRows?: number;
    width?: number;
    isDraggable?: boolean;
    isResizable?: boolean;
    isBounded?: boolean;
    preventCollision?: boolean;
    useCSSTransforms?: boolean;
    margin?: [number, number];
    containerPadding?: [number, number] | null;
    compactType?: "vertical" | "horizontal" | null;
    preventCollisionWithChildren?: boolean;
    preventCollisionWhenDragging?: boolean;
    draggableHandle?: string;
    draggableCancel?: string;
    cancel?: string;
    resizeHandles?: string[];
    onLayoutChange?: (layout: Layout[], layouts: Layouts) => void;
    onBreakpointChange?: (newBreakpoint: string, newCols: number) => void;
    onWidthChange?: (
      containerWidth: number,
      margin: [number, number],
      cols: number,
      containerPadding: [number, number] | null,
    ) => void;
    onDrag?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      event: MouseEvent,
      element: HTMLElement,
    ) => void;
    onDragStart?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      event: MouseEvent,
      element: HTMLElement,
    ) => void;
    onDragStop?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      event: MouseEvent,
      element: HTMLElement,
    ) => void;
    onResize?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      event: MouseEvent,
      element: HTMLElement,
    ) => void;
    onResizeStart?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      event: MouseEvent,
      element: HTMLElement,
    ) => void;
    onResizeStop?: (
      layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      placeholder: Layout,
      event: MouseEvent,
      element: HTMLElement,
    ) => void;
    onContainerMounted?: () => void;
    children?: React.ReactNode;
  }

  declare class GridLayout extends React.Component<
    GridLayoutProps & { measureBeforeMount?: boolean }
  > {}

  export interface WidthProviderProps {
    measureBeforeMount?: boolean;
    onWidthChange?: (width: number) => void;
  }

  export function WidthProvider(
    WrappedComponent: typeof GridLayout,
  ): React.ComponentType<GridLayoutProps & WidthProviderProps>;

  export default GridLayout;
}

declare module "react-resizable" {
  import React from "react";

  export interface ResizeCallbackData {
    node: HTMLElement;
    size: { width: number; height: number };
    handle: string;
  }

  export interface ResizeableProps {
    height?: number;
    width?: number;
    resizeHandles?: string[];
    onResize?: (event: React.SyntheticEvent, data: ResizeCallbackData) => void;
    onResizeStart?: (
      event: React.SyntheticEvent,
      data: ResizeCallbackData,
    ) => void;
    onResizeStop?: (
      event: React.SyntheticEvent,
      data: ResizeCallbackData,
    ) => void;
    draggableOpts?: any;
    children?: React.ReactNode;
  }

  export class Resizable extends React.Component<ResizeableProps> {}
}
