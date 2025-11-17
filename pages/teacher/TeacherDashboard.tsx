
import React from 'react';
import { Card } from '../../components/ui/Card';

const TeacherDashboard: React.FC = () => {
    // Mock data
    const stats = [
        { label: 'Active Assignments', value: '5' },
        { label: 'Submissions Awaiting Review', value: '12' },
        { label: 'Total Students', value: '34' },
    ];

    const recentSubmissions = [
        { student: 'Alice', assignment: 'Prepositions Homework', status: 'Graded' },
        { student: 'Bob', assignment: 'Grammar Worksheet 1', status: 'Submitted' },
        { student: 'Charlie', assignment: 'Prepositions Homework', status: 'Submitted' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Teacher Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <Card key={stat.label}>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                    </Card>
                ))}
            </div>

            <Card title="Recent Activity">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentSubmissions.map((sub, index) => (
                        <li key={index} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.student}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{sub.assignment}</p>
                            </div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                sub.status === 'Graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {sub.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default TeacherDashboard;
