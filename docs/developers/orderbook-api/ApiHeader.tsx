export default function ApiHeader({
  method,
  path,
  description,
}: {
  method: string;
  path: string;
  description: string;
}) {
  const tagColor =
    method === "POST"
      ? "#49CC90"
      : method === "GET" || method === "WSS"
      ? "#61AFFE"
      : method === "DELETE"
      ? "#F93E3D"
      : method === "PUT"
      ? "#FCA12F"
      : "";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 4px",
        borderRadius: 4,
        border: `1px solid ${tagColor}`,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          backgroundColor: tagColor,
          color: "white",
          padding: "4px 8px",
          borderRadius: 4,
        }}
      >
        {method}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        {path}
      </div>
      <div
        style={{
          fontSize: 12,
        }}
      >
        {description}
      </div>
    </div>
  );
}
