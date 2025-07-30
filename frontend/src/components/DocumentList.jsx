export default function DocumentList({ documents }) {
  if (!documents || documents.length === 0) {
    return <p className="text-gray-500">No documents uploaded yet.</p>;
  }

  return (
    <ul className="list-disc pl-6 space-y-2">
      {documents.map((doc, index) => (
        <li key={index}>
          <a
            href="#"
            className="text-blue-500 underline hover:text-blue-700"
            download
          >
            {doc}
          </a>
        </li>
      ))}
    </ul>
  );
}
