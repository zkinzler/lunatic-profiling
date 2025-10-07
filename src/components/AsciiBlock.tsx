interface AsciiBlockProps {
  content: string;
}

export default function AsciiBlock({ content }: AsciiBlockProps) {
  return (
    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
      <pre className="text-green-400 whitespace-pre-wrap overflow-x-auto">
        {content}
      </pre>
    </div>
  );
}