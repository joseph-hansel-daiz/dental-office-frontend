"use client";

import { useEffect } from "react";
import "@/styles/custom-bootstrap.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function BootstrapClient() {
  useEffect(() => {
    // @ts-expect-error: No types for this module
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
