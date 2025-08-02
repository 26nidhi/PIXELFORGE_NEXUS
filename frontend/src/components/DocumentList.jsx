export default function DocumentList({ documents }) {
  if (!documents || documents.length === 0) {
    return <p className="text-gray-500">No documents uploaded yet.</p>;
  }

  const getFileUrl = (filepath) => `http://localhost:5000/${filepath}`;

  const isPreviewable = (filename) => {
    const previewTypes = [".pdf", ".png", ".jpg", ".jpeg", ".gif"];
    return previewTypes.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  return (
    <ul className="list-disc pl-6 space-y-2">
      {documents.map((doc) => (
        <li key={doc._id} className="flex items-center justify-between">
          <span>{doc.filename}</span>
          <div className="space-x-2">
            {isPreviewable(doc.filename) ? (
              <a
                href={getFileUrl(doc.filepath)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                Preview
              </a>
            ) : (
              <a
                href={getFileUrl(doc.filepath)}
                download={doc.filename}
                className="text-green-500 underline hover:text-green-700"
              >
                Download
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
