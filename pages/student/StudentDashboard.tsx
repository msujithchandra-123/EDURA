
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { geminiService } from '../../services/geminiService';
import { MonthlyScore } from '../../types';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState<{ summary: string; monthlyScores: MonthlyScore[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const data = await geminiService.generateStudentAnalytics(user.id);
                    setAnalytics(data);
                } catch (error) {
                    console.error("Failed to fetch analytics", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAnalytics();
    }, [user]);

    if (loading) {
        return <Spinner size="lg" className="mt-20" />;
    }

    if (!analytics) {
        return <div className="text-center text-gray-500">Could not load analytics data.</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Performance Trends (Last 6 Months)">
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart data={analytics.monthlyScores}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="homeworkScore" stroke="#8884d8" activeDot={{ r: 8 }} name="Homework" />
                                    <Line type="monotone" dataKey="worksheetScore" stroke="#82ca9d" name="Worksheet" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card title="AI Performance Summary">
                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                             {analytics.summary.split('\n\n').map((paragraph, i) => (
                                <div key={i}>
                                {paragraph.split('\n').map((line, j) => {
                                     if(line.startsWith('**')){
                                         return <p key={j} className="font-bold">{line.replace(/\*\*/g, '')}</p>
                                     }
                                     return <p key={j}>{line}</p>
                                })}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
