import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface EmailJob {
    id: string;
    recipient: string;
    subject: string;
    sentAt: string;
    status: string;
}

const SentEmails = () => {
    const [jobs, setJobs] = useState<EmailJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/sent-emails');
                setJobs(res.data);
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return <div className="text-gray-400">Loading sent history...</div>;

    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-500 text-lg">No sent emails found.</p>
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
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sent Time</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-[#1F2937] divide-y divide-gray-700">
                    {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.recipient}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {job.sentAt ? format(new Date(job.sentAt), 'MMM dd, yyyy HH:mm a') : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'SENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {job.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SentEmails;
