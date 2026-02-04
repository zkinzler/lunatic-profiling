import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { GHOST_TYPES } from '@/lib/culling/ghosts';
import type { GhostCode } from '@/lib/culling/ghosts';

interface PageProps {
  params: Promise<{ publicId: string }>;
}

// Generate metadata for social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params;

  const session = await prisma.cullingSession.findUnique({
    where: { publicId },
    include: { result: true },
  });

  if (!session || !session.result) {
    return {
      title: 'The Culling - Results Not Found',
      description: 'Take The Culling quiz to discover your comedic ghost type.',
    };
  }

  const result = session.result;
  const isElite = result.isElite;
  const dominantGhost = result.dominantGhost as GhostCode | null;
  const ghostName = dominantGhost ? GHOST_TYPES[dominantGhost].fullTitle : 'Unknown';

  const title = isElite
    ? `I'm in the 4%! My ghost type: ${ghostName}`
    : `I was CULLED by The Culling`;

  const description = result.shareText || 'Take The Culling quiz to discover if you have what it takes.';

  return {
    title: `The Culling - ${title}`,
    description,
    openGraph: {
      title: `The Culling - ${title}`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `The Culling - ${title}`,
      description,
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const { publicId } = await params;

  const session = await prisma.cullingSession.findUnique({
    where: { publicId },
    include: { result: true },
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-red-500">Result Not Found</h1>
          <p className="text-gray-400">
            This result either doesn&apos;t exist or has been lost to the void.
          </p>
          <a
            href="/culling"
            className="inline-block px-8 py-4 bg-red-600 rounded-lg text-white font-bold hover:bg-red-500 transition-all"
          >
            Take The Culling
          </a>
        </div>
      </div>
    );
  }

  const result = session.result;

  if (!result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-red-500">Quiz Incomplete</h1>
          <p className="text-gray-400">
            This person started The Culling but didn&apos;t finish. Probably couldn&apos;t handle it.
          </p>
          <a
            href="/culling"
            className="inline-block px-8 py-4 bg-red-600 rounded-lg text-white font-bold hover:bg-red-500 transition-all"
          >
            Take The Culling
          </a>
        </div>
      </div>
    );
  }

  const isElite = result.isElite;
  const dominantGhost = result.dominantGhost as GhostCode | null;
  const ghostDetails = dominantGhost ? GHOST_TYPES[dominantGhost] : null;

  // Calculate percentages
  const totalScore = result.ghostCD + result.ghostCA + result.ghostOB + result.ghostDD;
  const percentages = totalScore > 0
    ? {
        CD: Math.round((result.ghostCD / totalScore) * 100),
        CA: Math.round((result.ghostCA / totalScore) * 100),
        OB: Math.round((result.ghostOB / totalScore) * 100),
        DD: Math.round((result.ghostDD / totalScore) * 100),
      }
    : { CD: 0, CA: 0, OB: 0, DD: 0 };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          {/* Status badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isElite
                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 text-purple-300'
                : 'bg-red-950/50 border border-red-500/50 text-red-400'
            }`}
          >
            {isElite ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-bold">THE 4%</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-bold">THE 96%</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1
            className={`text-3xl md:text-5xl font-bold ${
              isElite
                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent'
                : 'text-red-500'
            }`}
          >
            {result.resultTitle}
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
            {result.resultDescription}
          </p>
        </div>

        {/* Ghost details */}
        {ghostDetails && (
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">
              Ghost Type: {ghostDetails.fullTitle}
            </h3>
            <p className="text-gray-400">{ghostDetails.description}</p>
            <div className="flex flex-wrap gap-2">
              {ghostDetails.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-sm text-gray-300"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Score breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Ghost Classification</h3>
          {(['CD', 'CA', 'OB', 'DD'] as GhostCode[]).map((code) => {
            const ghost = GHOST_TYPES[code];
            const score = code === 'CD' ? result.ghostCD :
                         code === 'CA' ? result.ghostCA :
                         code === 'OB' ? result.ghostOB : result.ghostDD;
            const percentage = percentages[code];
            const isDominant = code === dominantGhost;

            return (
              <div
                key={code}
                className={`p-4 rounded-lg border ${
                  isDominant ? 'border-white/30 bg-white/5' : 'border-gray-800 bg-gray-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{ghost.name}</span>
                    {isDominant && (
                      <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-white font-mono">
                        DOMINANT
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-gray-400">{score}/10</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="space-y-4 pt-4">
          <a
            href="/culling"
            className={`block w-full py-4 rounded-lg font-bold text-center transition-all ${
              isElite
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                : 'bg-red-600 text-white hover:bg-red-500'
            }`}
          >
            Take The Culling
          </a>
          <p className="text-center text-gray-500 text-sm">
            {isElite
              ? 'Think you have what it takes to join the 4%?'
              : '96% get culled. Are you one of them?'}
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs font-mono pt-4">
          The Culling - A Comedy Classification Protocol
        </p>
      </div>
    </div>
  );
}
