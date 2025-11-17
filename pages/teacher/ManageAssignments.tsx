
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Assignment, AssignmentType } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import CreateAssignmentModal from '../../components/CreateAssignmentModal';

const ManageAssignments: React.FC = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                const homework = await api.getTeacherAssignments('homework');
                const worksheets = await api.getTeacherAssignments('worksheet');
                setAssignments([...homework, ...worksheets].sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()));
            } catch (error) {
                console.error("Failed to fetch assignments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    const handleAssignmentCreated = (newAssignment: Assignment) => {
        setAssignments(prev => [newAssignment, ...prev]);
    };

    if (loading) return <Spinner size="lg" />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Assignments</h1>
                <Button onClick={() => setIsModalOpen(true)}>Create New Assignment</Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {assignments.map(assignment => (
                                <tr key={assignment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{assignment.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">{assignment.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Link to={`/teacher/submissions/${assignment.id}`} className="text-primary-600 hover:text-primary-900">View Submissions</Link>
                                        <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <CreateAssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAssignmentCreated={handleAssignmentCreated}
            />
        </div>
    );
};

export default ManageAssignments;
