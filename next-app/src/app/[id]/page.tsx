import { notFound } from 'next/navigation';

export default async function User({ params }: { params: { id: string } }) {
  // Check if id is a valid number
  const { id } = await params;
  if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
    notFound();
  }
  return (
    <div>
      <h1>User {id}</h1>
    </div>
  );
}