import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface EmailJob {
    id: string;
    recipient: string;
    subject: string;
    scheduledAt: string;
    status: string;
}

const ScheduledEmails = () => {
    const [jobs, setJobs] = useState<EmailJob[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            // Replace with env var in real app
            const res = await axios.get('http://localhost:3000/api/scheduled-emails');
            setJobs(res.data);
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 5000); // Polling for updates
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this scheduled email?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/schedule/${id}`);
            setJobs(jobs.filter(job => job.id !== id));
        } catch (error) {
            console.error('Failed to delete job', error);
            alert('Failed to delete scheduled email');
        }
    };

    if (loading) return <div className="text-gray-400">Loading scheduled emails...</div>;

    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-500 text-lg">No scheduled emails found.</p>
                <p className="text-gray-600 text-sm mt-1">Click "Compose" to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1F2937] rounded-xl shadow-xl overflow-hidden border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Recipient</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Scheduled Time</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-[#1F2937] divide-y divide-gray-700">
                    {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.recipient}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {format(new Date(job.scheduledAt), 'MMM dd, yyyy HH:mm a')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                                    {job.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleDelete(job.id)}
                                    className="text-red-400 hover:text-red-300 transition-colors bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg border border-red-400/20"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduledEmails;
