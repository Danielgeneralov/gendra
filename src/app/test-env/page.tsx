'use client';

export default function TestEnv() {
  return (
    <div className="p-8">
      <h1>Environment Variables Test</h1>
      <pre>
        API URL: {process.env.NEXT_PUBLIC_API_URL}
      </pre>
    </div>
  );
} 