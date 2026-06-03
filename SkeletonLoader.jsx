function Box({ w = "100%", h = 16, mt = 0 }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, marginTop: mt, borderRadius: 6 }}
    />
  );
}

export function ProfileSkeleton() {
  return (
    <div style={{
      display: "flex", gap: 24,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: 24,
    }}>
      <div className="skeleton" style={{ width: 80, height: 80, borderRadius: "50%", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <Box w={180} h={20} />
        <Box w="90%" h={13} mt={10} />
        <Box w="70%" h={13} mt={6} />
        <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
          <Box w={60} h={13} />
          <Box w={60} h={13} />
          <Box w={60} h={13} />
        </div>
      </div>
    </div>
  );
}

export function RepoSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "14px 18px",
          }}
        >
          <Box w={200} h={14} />
          <Box w="80%" h={12} mt={8} />
        </div>
      ))}
    </div>
  );
}
