import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import ScheduledEmails from './ScheduledEmails';
import SentEmails from './SentEmails';
import ComposeModal from '../components/ComposeModal';
import Layout from '../components/Layout';

const Dashboard = () => {
    const location = useLocation();
    const [isComposeOpen, setIsComposeOpen] = useState(false);

    const title = location.pathname === '/' ? 'Scheduled Emails' : 'Sent History';

    return (
        <Layout
            title={title}
            action={
                <button
                    onClick={() => setIsComposeOpen(true)}
                    className="glass-button flex items-center px-6 py-3 rounded-xl font-medium"
                >
                    <FiPlus className="w-5 h-5 mr-2" />
                    Compose
                </button>
            }
        >
            <Routes>
                <Route path="/" element={<ScheduledEmails />} />
                <Route path="/sent" element={<SentEmails />} />
            </Routes>

            {/* Compose Modal */}
            {isComposeOpen && <ComposeModal onClose={() => setIsComposeOpen(false)} />}
        </Layout>
    );
};

export default Dashboard;
