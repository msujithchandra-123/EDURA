
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Assignment, SubmissionStatus } from '../../types';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

const AssignmentCard: React.FC<{ assignment: Assignment, status: SubmissionStatus }> = ({ assignment, status }) => {
    const getStatusBadge = () => {
        switch (status) {
            case SubmissionStatus.SUBMITTED:
                return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Submitted</span>;
            case SubmissionStatus.GRADED:
                return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">Graded</span>;
            default:
                return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">Not Started</span>;
        }
    };
    
    return (
        <Card>
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{assignment.title}</h3>
                {getStatusBadge()}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{assignment.instructions}</p>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
            <div className="mt-4">
                <Link to={`/student/homework/${assignment.id}`}>
                    <Button size="sm">
                        {status === SubmissionStatus.PENDING ? 'Start Assignment' : 'View Details'}
                    </Button>
                </Link>
            </div>
        </Card>
    );
};

const StudentHomework: React.FC = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [statuses, setStatuses] = useState<Record<string, SubmissionStatus>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomework = async () => {
            try {
                setLoading(true);
                const fetchedAssignments = await api.getStudentAssignments('homework');
                const fetchedStatuses = await api.getSubmissionStatuses(fetchedAssignments.map(a => a.id));
                setAssignments(fetchedAssignments);
                setStatuses(fetchedStatuses);
            } catch (error) {
                console.error("Failed to fetch homework", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomework();
    }, []);

    if (loading) {
        return <Spinner size="lg" className="mt-20" />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Homework</h1>
            {assignments.length === 0 ? (
                <p className="text-gray-500">No homework assignments found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map(assignment => (
                        <AssignmentCard key={assignment.id} assignment={assignment} status={statuses[assignment.id] || SubmissionStatus.PENDING} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentHomework;
