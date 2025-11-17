import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { geminiService } from '../../services/geminiService';
import { Assignment, Submission, SubmissionStatus, AIFeedback } from '../../types';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/FileUpload';
import AIAvatar from '../../components/AIAvatar';

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

const AssignmentView: React.FC<{ type: 'homework' }> = ({ type }) => {
    const { id } = useParams<{ id: string }>();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFeedbackAvatar, setShowFeedbackAvatar] = useState(false);
    const [isTalking, setIsTalking] = useState(false);

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
            } catch (error) {
                console.error("Failed to fetch assignment data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleFileUpload = async (file: File) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            const feedback = await geminiService.evaluateHomeworkVideo(file);
            const newSubmission: Submission = {
                id: `sub-${Date.now()}`,
                assignmentId: id,
                studentId: 'student-1',
                submittedAt: new Date().toISOString(),
                status: SubmissionStatus.GRADED,
                contentUrl: file.name,
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
    if (!assignment) return <div className="text-center text-gray-500">Assignment not found.</div>;

    const isSubmitted = submission && submission.status !== SubmissionStatus.PENDING;

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

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{assignment.title}</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Due: {new Date(assignment.dueDate).toLocaleString()}</p>
            
            <Card className="mt-6">
                <h2 className="text-lg font-semibold">Instructions</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{assignment.instructions}</p>
            </Card>

            <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    {isSubmitted ? 'Your Submission' : 'Submit Your Work'}
                </h2>
                {isSubmitted && submission ? (
                    <div>
                        <p className="dark:text-white">You submitted: <span className="font-semibold">{submission.contentUrl}</span></p>
                        {submission.feedback && <FeedbackDisplay feedback={submission.feedback} />}
                    </div>
                ) : (
                    isSubmitting ? (
                        <Card>
                            <div className="flex flex-col items-center justify-center p-8">
                                <Spinner size="lg" />
                                <p className="mt-4 text-gray-600 dark:text-gray-300">Evaluating your submission with AI...</p>
                            </div>
                        </Card>
                    ) : (
                        <FileUpload onFileUpload={handleFileUpload} accept="video/*" buttonText="Submit Video" />
                    )
                )}
            </div>
            {showFeedbackAvatar && submission?.feedback && renderFeedbackAvatar()}
        </div>
    );
};

export default AssignmentView;
