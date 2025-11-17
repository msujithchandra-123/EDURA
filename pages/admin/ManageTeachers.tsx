
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Teacher } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

const ManageTeachers: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            const data = await api.getTeachers();
            setTeachers(data);
            setLoading(false);
        };
        fetchTeachers();
    }, []);

    if (loading) return <Spinner size="lg" />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Teachers</h1>
                <Button>Add Teacher</Button>
            </div>

            <Card>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="py-2">Register No</th>
                            <th className="py-2">Name</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                            <tr key={teacher.id} className="border-t">
                                <td className="py-2">{teacher.registerNo}</td>
                                <td className="py-2">{teacher.name}</td>
                                <td className="py-2 space-x-2">
                                    <Button size="sm" variant="secondary">Edit</Button>
                                    <Button size="sm" variant="danger">Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default ManageTeachers;
