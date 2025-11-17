
import React from 'react';
import { Card } from '../../components/ui/Card';

const AdminDashboard: React.FC = () => {
    // Mock data
    const stats = [
        { label: 'Total Students', value: '152' },
        { label: 'Total Teachers', value: '15' },
        { label: 'Total Submissions', value: '789' },
        { label: 'Active Assignments', value: '25' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <Card key={stat.label}>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                    </Card>
                ))}
            </div>

            <Card title="System Health">
                <p>All systems operational.</p>
            </Card>
        </div>
    );
};

export default AdminDashboard;
