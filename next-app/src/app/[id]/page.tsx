import { notFound } from 'next/navigation';

export default function User({ params }: { params: { id: string } }) {
  // Check if id is a valid number
  const id = parseInt(params.id);
  if (isNaN(id) || id <= 0) {
    notFound();
  }
  return (
    <div>
      <h1>User {id}</h1>
    </div>
  );
}