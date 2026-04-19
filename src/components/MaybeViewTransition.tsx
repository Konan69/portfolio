"use client";

import * as React from "react";

type MaybeViewTransitionProps = React.ViewTransitionProps & {
  transitionKey?: React.Key;
};

type ReactWithViewTransition = typeof React & {
  ViewTransition?: React.ExoticComponent<React.ViewTransitionProps>;
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
