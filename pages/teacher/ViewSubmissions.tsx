
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Submission, Student } from '../../types';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

const ViewSubmissions: React.FC = () => {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [students, setStudents] = useState<Record<string, Student>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!assignmentId) return;
            setLoading(true);
            const subs = await api.getSubmissionsForAssignment(assignmentId);
            setSubmissions(subs);
            // In a real app, you might fetch student details separately or get them with submissions
            const studentData = await api.getStudents(); 
            const studentMap = studentData.reduce((acc, student) => {
                acc[student.id] = student;
                return acc;
            }, {} as Record<string, Student>);
            setStudents(studentMap);
            setLoading(false);
        };
        fetchData();
    }, [assignmentId]);

    if (loading) return <Spinner size="lg" />;
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Submissions for Assignment</h1>

            <Card>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="py-2">Student</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">AI Score</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {submissions.map(sub => (
                        <tr key={sub.id} className="border-t">
                            <td className="py-2">{students[sub.studentId]?.name || 'Unknown Student'}</td>
                            <td className="py-2">{sub.status}</td>
                            <td className="py-2">{sub.feedback ? `${sub.feedback.score}/100` : 'N/A'}</td>
                            <td className="py-2">
                                <Button size="sm">View Details</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default ViewSubmissions;
