
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { geminiService } from '../../services/geminiService';
import { Assignment, Submission, SubmissionStatus, AIFeedback } from '../../types';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import AIAvatar from '../../components/AIAvatar';
import { DynamicWorksheetForm } from '../../components/DynamicWorksheetForm';

const FeedbackDisplay: React.FC<{ feedback: AIFeedback }> = ({ feedback }) => (
    <Card title="AI Feedback" className="mt-6 bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Overall Score</h4>
            <span className={`text-2xl font-bold ${feedback.score > 80 ? 'text-green-600' : feedback.score > 60 ? 'text-yellow-600' : 'text-red-600'}`}>{feedback.score}/100</span>
        </div>
        <div className="mt-4">
            <h5 className="font-semibold text-gray-700 dark:text-gray-200">Summary:</h5>
            <p className="text-gray-600 dark:text-gray-300">{feedback.summary}</p>
        </div>
        <div className="mt-4">
            <h5 className="font-semibold text-gray-700 dark:text-gray-200">Detailed Feedback:</h5>
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: feedback.detailedFeedback.replace(/\n/g, '<br/>') }} />
        </div>
    </Card>
);

const WorksheetView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFeedbackAvatar, setShowFeedbackAvatar] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const isSubmitted = submission && submission.status !== SubmissionStatus.PENDING;
    
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [ass, sub] = await Promise.all([
                    api.getAssignmentById(id),
                    api.getSubmissionForAssignment(id)
                ]);
                setAssignment(ass);
                setSubmission(sub);
                 if (sub && sub.textAnswers) {
                    setAnswers(sub.textAnswers);
                }
            } catch (error) {
                console.error("Failed to fetch worksheet data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAnswerChange = (questionId: string, value: any) => {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setIsSubmitting(true);
        try {
            const feedback = await geminiService.evaluateWorksheet(answers);
            const newSubmission: Submission = {
                id: `sub-${Date.now()}`,
                assignmentId: id,
                studentId: 'student-1',
                submittedAt: new Date().toISOString(),
                status: SubmissionStatus.GRADED,
                textAnswers: answers,
                feedback: feedback
            };
            await api.createSubmission(newSubmission);
            setSubmission(newSubmission);
            setShowFeedbackAvatar(true);
            setIsTalking(true);
            setTimeout(() => setIsTalking(false), 8000); // Animation duration
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) return <Spinner size="lg" className="mt-20" />;
    if (!assignment) return <div className="text-center text-gray-500">Worksheet not found.</div>;
    
    const renderFeedbackAvatar = () => (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-end z-50 p-4 animate-fade-in">
          <Card className="w-full max-w-2xl mb-4">
             <div className="text-center p-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Here's my feedback!</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">"{submission?.feedback?.summary}"</p>
                <p className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Your Score: <span className={`${submission?.feedback?.score ?? 0 > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{submission?.feedback?.score}/100</span></p>
             </div>
          </Card>
          <AIAvatar isTalking={isTalking} />
          <Button onClick={() => setShowFeedbackAvatar(false)} className="mt-4">
              View Detailed Report
          </Button>
        </div>
    );

    const formSchema = assignment.formSchema;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{assignment.title}</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Due: {new Date(assignment.dueDate).toLocaleString()}</p>
            
            <Card className="mt-6">
                <h2 className="text-lg font-semibold dark:text-white">Instructions</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{assignment.instructions}</p>
            </Card>

            <form onSubmit={handleSubmit}>
                <Card className="mt-6">
                     {formSchema ? (
                        <DynamicWorksheetForm
                            schema={formSchema.questions}
                            answers={answers}
                            onAnswerChange={handleAnswerChange}
                            isSubmitted={isSubmitted}
                        />
                     ) : (
                        <p className="text-gray-500 dark:text-gray-400">This worksheet is not available as an interactive form.</p>
                     )}
                </Card>

                {isSubmitting && (
                    <Card className="mt-6">
                        <div className="flex flex-col items-center justify-center p-8">
                            <Spinner size="lg" />
                            <p className="mt-4 text-gray-600 dark:text-gray-300">Grading your worksheet with AI...</p>
                        </div>
                    </Card>
                )}

                {!isSubmitted && !isSubmitting && formSchema && (
                    <div className="mt-6 flex justify-end">
                        <Button type="submit" isLoading={isSubmitting}>Submit Worksheet</Button>
                    </div>
                )}
            </form>
            
            {isSubmitted && submission?.feedback && <FeedbackDisplay feedback={submission.feedback} />}
            {showFeedbackAvatar && submission?.feedback && renderFeedbackAvatar()}
        </div>
    );
};

export default WorksheetView;