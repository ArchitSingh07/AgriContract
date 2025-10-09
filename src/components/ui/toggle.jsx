"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle@1.1.2";
import { cva, 

function Toggle({
  className,
  variant,
  size,
  ...props
} &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };


