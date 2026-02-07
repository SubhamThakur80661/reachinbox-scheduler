import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiUpload, FiClock, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface ComposeModalProps {
    onClose: () => void;
}

const ComposeModal = ({ onClose }: ComposeModalProps) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [recipient, setRecipient] = useState('');
    const [csvRecipients, setCsvRecipients] = useState<string[]>([]);
    const [scheduledAt, setScheduledAt] = useState('');
    const [isScheduling, setIsScheduling] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
            if (emails.length > 0) {
                setCsvRecipients(emails);
                alert(`Found ${emails.length} emails in file!`);
            } else {
                alert('No emails found in file.');
            }
        };
        reader.readAsText(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsScheduling(true);

        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user?.id;

        if (!userId) {
            alert('User ID missing. Please log out and log in again.');
            setIsScheduling(false);
            return;
        }

        const recipientsToProcess = csvRecipients.length > 0 ? csvRecipients : [recipient];

        try {
            for (const rec of recipientsToProcess) {
                await axios.post('http://localhost:3000/api/schedule', {
                    recipient: rec,
                    subject,
                    body,
                    scheduledAt,
                    userId
                });
            }

            alert('Emails Scheduled Successfully!');
            onClose();
        } catch (error: any) {
            console.error('Scheduling failed', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to schedule emails.';
            alert(`Scheduling Failed: ${errorMessage}`);
        } finally {
            setIsScheduling(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden relative z-10"
                >
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/50 bg-gray-900/30">
                        <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                New Campaign
                            </h3>
                            <p className="text-xs text-gray-400">Compose and schedule your emails</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Subject */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Subject</label>
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="glass-input w-full px-4 py-3 rounded-xl outline-none"
                                placeholder="E.g. Monthly Newsletter"
                            />
                        </div>

                        {/* Recipients */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Recipient (Single)</label>
                                <input
                                    type="email"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    disabled={csvRecipients.length > 0}
                                    className="glass-input w-full px-4 py-3 rounded-xl outline-none disabled:opacity-50"
                                    placeholder="client@company.com"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Bulk Upload (CSV)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".csv,.txt"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className={`flex items-center justify-center w-full px-4 py-3 border border-dashed rounded-xl cursor-pointer transition-all ${csvRecipients.length > 0
                                            ? 'border-green-500/50 bg-green-500/10 text-green-400'
                                            : 'border-gray-600 hover:border-blue-500/50 hover:bg-blue-500/5 text-gray-400 hover:text-blue-400'
                                            }`}
                                    >
                                        <FiUpload className="w-4 h-4 mr-2" />
                                        <span className="text-sm font-medium">
                                            {csvRecipients.length > 0 ? `${csvRecipients.length} emails loaded` : 'Choose valid CSV'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Message</label>
                            <textarea
                                required
                                rows={6}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="glass-input w-full px-4 py-3 rounded-xl outline-none resize-none"
                                placeholder="Type your email content here..."
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 mt-2">
                            <div className="flex items-center space-x-3 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                                <FiClock className="text-blue-400" />
                                <input
                                    type="datetime-local"
                                    required
                                    value={scheduledAt}
                                    onChange={(e) => setScheduledAt(e.target.value)}
                                    className="bg-transparent text-sm text-gray-200 outline-none [color-scheme:dark]"
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isScheduling}
                                    className="glass-button px-6 py-2.5 rounded-xl font-medium flex items-center shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isScheduling ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Scheduling...
                                        </span>
                                    ) : (
                                        <>
                                            <span className="mr-2">Schedule</span>
                                            <FiSend className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ComposeModal;
