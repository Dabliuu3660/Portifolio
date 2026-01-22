export default function HealthCheck() {
    return (
        <div style={{ padding: 20 }}>
            <h1>System Status: Online</h1>
            <p>If you can see this page, the Next.js server is running correctly.</p>
            <p>Timestamp: {new Date().toISOString()}</p>
        </div>
    );
}
