"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <SwaggerUI url="/api/docs" docExpansion="list" defaultModelsExpandDepth={1} />
    </div>
  );
}
