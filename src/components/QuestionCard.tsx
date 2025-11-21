interface Answer {
  id: string;
  text: string;
  weight: Record<string, number | undefined>;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

interface QuestionCardProps {
  question: Question;
  selectedAnswers: string[];
  onAnswerSelect: (questionId: number, answerId: string, isSelected: boolean) => void;
}

export default function QuestionCard({
  question,
  selectedAnswers,
  onAnswerSelect,
}: QuestionCardProps) {
  const handleAnswerClick = (answerId: string) => {
    const isSelected = selectedAnswers.includes(answerId);
    onAnswerSelect(question.id, answerId, !isSelected);
  };

  return (
    <div className="glass-strong rounded-3xl p-8 md:p-10 hover-glow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text-cosmic">
          Question {question.id}
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
          <span className="text-sm text-gray-300">Selected:</span>
          <span className="text-lg font-bold gradient-text">
            {selectedAnswers.length}/3
          </span>
        </div>
      </div>

      <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed font-medium">
        {question.question}
      </p>

      <div className="space-y-4">
        {question.answers.map((answer) => {
          const isSelected = selectedAnswers.includes(answer.id);
          const rank = selectedAnswers.indexOf(answer.id) + 1;

          return (
            <button
              key={answer.id}
              onClick={() => handleAnswerClick(answer.id)}
              className={`group w-full text-left p-5 md:p-6 rounded-2xl transition-all duration-300 transform ${isSelected
                  ? 'glass-strong border-2 border-pink-400 glow-pink scale-[1.02]'
                  : 'glass border border-white/10 hover:border-white/30 hover:scale-[1.01] hover:glass-strong'
                }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className={`flex-1 text-base md:text-lg transition-colors ${isSelected
                    ? 'text-white font-semibold'
                    : 'text-gray-200 group-hover:text-white'
                  }`}>
                  {answer.text}
                </span>
                {isSelected && (
                  <div className="flex items-center justify-center min-w-[3rem] h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 glow-pink">
                    <span className="text-white font-bold text-lg">
                      #{rank}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 glass rounded-xl text-center">
        <p className="text-gray-200 text-sm md:text-base">
          💫 Select up to 3 answers and rank them in order of preference
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Your first choice counts most, followed by your second and third
        </p>
      </div>
    </div>
  );
}