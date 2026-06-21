"use client";

import * as React from "react";

type ViewTransitionProps = {
  children?: React.ReactNode;
  name?: string;
  enter?: string;
  exit?: string;
  update?: string;
  default?: string;
};

type MaybeViewTransitionProps = ViewTransitionProps & {
  transitionKey?: React.Key;
};

type ReactWithViewTransition = typeof React & {
  ViewTransition?: React.ExoticComponent<ViewTransitionProps>;
};

const runtimeReact = React as ReactWithViewTransition;

export const hasReactViewTransition = typeof runtimeReact.ViewTransition === "function";

export function MaybeViewTransition({
  children,
  transitionKey,
  ...props
}: MaybeViewTransitionProps) {
  const ViewTransition = runtimeReact.ViewTransition;

  if (!ViewTransition) {
    return <React.Fragment key={transitionKey}>{children}</React.Fragment>;
  }

  return (
    <ViewTransition key={transitionKey} {...props}>
      {children}
    </ViewTransition>
  );
}
