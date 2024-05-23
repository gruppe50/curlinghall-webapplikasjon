import React from 'react'

const DummyPage = ({ title }: { title: string }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {title}
    </main>
  );
}

export default DummyPage;