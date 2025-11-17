
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

const ManageStudents: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            const data = await api.getStudents();
            setStudents(data);
            setLoading(false);
        };
        fetchStudents();
    }, []);
    
    if (loading) return <Spinner size="lg" />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Students</h1>
                <Button>Add Student</Button>
            </div>

            <Card>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="py-2">Roll No</th>
                            <th className="py-2">Name</th>
                            <th className="py-2">Class</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="border-t">
                                <td className="py-2">{student.rollNo}</td>
                                <td className="py-2">{student.name}</td>
                                <td className="py-2">{student.class} - {student.section}</td>
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

export default ManageStudents;
