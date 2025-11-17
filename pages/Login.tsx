
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Login: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role>(Role.STUDENT);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(`/${user.role}/dashboard`);
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(selectedRole, username, password);
            navigate(`/${selectedRole}/dashboard`);
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const roleConfig = {
        [Role.STUDENT]: { label: 'Student', usernameLabel: 'Roll No.' },
        [Role.TEACHER]: { label: 'Teacher', usernameLabel: 'Register No.' },
        [Role.ADMIN]: { label: 'Admin', usernameLabel: 'Username' },
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <span className="text-primary-600 dark:text-primary-400 text-3xl font-bold">EDURA</span>
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            {Object.values(Role).map(role => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`flex-1 py-2 text-sm font-medium transition-colors duration-200 ${
                                        selectedRole === role
                                            ? 'text-primary-600 border-b-2 border-primary-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {roleConfig[role].label}
                                </button>
                            ))}
                        </div>
                        
                        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                            <div>
                                <Input 
                                  label={roleConfig[selectedRole].usernameLabel}
                                  type="text" 
                                  name="username" 
                                  id="username"
                                  placeholder={roleConfig[selectedRole].usernameLabel}
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  required 
                                />
                            </div>
                            <div>
                                <Input 
                                  label="Password"
                                  type="password" 
                                  name="password" 
                                  id="password" 
                                  placeholder="••••••••" 
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                />
                            </div>
                            
                            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
                            
                            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
