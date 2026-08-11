"use client";

import { useState } from "react";

export function usePasswordVisibility(initialState: boolean = false) {
  const [isVisible, setIsVisible] = useState(initialState);

  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };
  const inputType = isVisible ? "text" : "password";

  return { isVisible, toggleVisibility, inputType };
}