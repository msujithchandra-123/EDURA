
import React from 'react';
import { WorksheetQuestion } from '../types';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';

interface DynamicWorksheetFormProps {
  schema: WorksheetQuestion[];
  answers: Record<string, any>;
  onAnswerChange: (questionId: string, value: any) => void;
  isSubmitted: boolean;
}

export const DynamicWorksheetForm: React.FC<DynamicWorksheetFormProps> = ({ schema, onAnswerChange, answers, isSubmitted }) => {

  const renderQuestion = (question: WorksheetQuestion) => {
    const { id, type, question: questionText, options, lines } = question;
    const questionId = `q-${id}`;

    switch (type) {
      case 'fill-in-the-blank':
        const parts = questionText.split('____');
        return (
          <div key={questionId} className="flex flex-wrap items-center gap-2">
            <p className="dark:text-gray-300">{parts[0]}</p>
            <Input
              value={answers[questionId] || ''}
              onChange={e => onAnswerChange(questionId, e.target.value)}
              disabled={isSubmitted}
              aria-label={questionText}
              className="inline-block w-48"
            />
            <p className="dark:text-gray-300">{parts[1]}</p>
          </div>
        );
      
      case 'short_answer':
      case 'long_answer':
        return (
          <div key={questionId}>
            <p className="dark:text-gray-300 mb-2">{questionText}</p>
            <Textarea
                value={answers[questionId] || ''}
                onChange={e => onAnswerChange(questionId, e.target.value)}
                disabled={isSubmitted}
                aria-label={questionText}
                rows={lines || (type === 'long_answer' ? 6 : 3)}
            />
          </div>
        )

      case 'multiple_choice':
        return (
          <div key={questionId} className="dark:text-gray-300">
            <p className="mb-2">{questionText}</p>
            <div className="space-y-2">
              {options?.map(opt => (
                <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={questionId}
                    value={opt}
                    checked={answers[questionId] === opt}
                    onChange={e => onAnswerChange(questionId, e.target.value)}
                    disabled={isSubmitted}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'true_false':
        return (
          <div key={questionId} className="dark:text-gray-300">
            <p className="mb-2">{questionText}</p>
            <div className="flex gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio" name={questionId} value="True"
                  checked={answers[questionId] === 'True'}
                  onChange={e => onAnswerChange(questionId, e.target.value)}
                  disabled={isSubmitted}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                />
                <span>True</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio" name={questionId} value="False"
                  checked={answers[questionId] === 'False'}
                  onChange={e => onAnswerChange(questionId, e.target.value)}
                  disabled={isSubmitted}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                />
                <span>False</span>
              </label>
            </div>
          </div>
        );
      
      default:
        return <p key={questionId}>Unsupported question type: {type}</p>;
    }
  };

  return (
    <div className="space-y-8">
      {schema.map((question, index) => (
        <section key={question.id}>
          <h3 className="text-lg font-semibold mb-3 dark:text-white">Question {index + 1}</h3>
          {renderQuestion(question)}
        </section>
      ))}
    </div>
  );
};