import Link from 'next/link'

export default function PetCard({ pet }) {
  return (
    <div className="border p-4">
      <h2 className="text-xl font-bold">{pet.name}</h2>
      <p>{pet.description}</p>
      <Link href={`/pet/${pet.id}`}>
       Info
      </Link>
    </div>
  )
}
