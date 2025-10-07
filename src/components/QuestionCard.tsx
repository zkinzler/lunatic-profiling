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
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Question {question.id}
      </h2>
      <p className="text-xl text-gray-200 mb-8 leading-relaxed">
        {question.question}
      </p>
      <div className="space-y-3">
        {question.answers.map((answer) => {
          const isSelected = selectedAnswers.includes(answer.id);
          const rank = selectedAnswers.indexOf(answer.id) + 1;

          return (
            <button
              key={answer.id}
              onClick={() => handleAnswerClick(answer.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-purple-400 bg-purple-500/20 text-white'
                  : 'border-white/20 bg-white/5 text-gray-200 hover:border-white/40 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1">{answer.text}</span>
                {isSelected && (
                  <span className="ml-3 bg-purple-600 text-white text-sm px-2 py-1 rounded">
                    #{rank}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-300 text-sm">
          Select up to 3 answers and rank them in order of preference
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Selected: {selectedAnswers.length}/3
        </p>
      </div>
    </div>
  );
}