import React, { useEffect, useState } from 'react';
import { useGetAllMessageQuery } from '../../features/admin/adminAPI';

export default function Contact() {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetAllMessageQuery({ page: 1, limit: 50 });

    // State for filters
    const [filterType, setFilterType] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        console.log('API Data:', data);
        console.log('API Error:', error);
    }, [data, error]);

    if (isLoading) return <div>Loading messages...</div>;
    if (isError) {
        console.error("Error fetching messages:", error);
        return <div className="text-danger">Error loading messages.</div>;
    }

    // Use correct key based on your actual response structure
    const contacts = data?.message || [];

    // Helper functions
    const isToday = (date) => {
        const inputDate = new Date(date).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        return inputDate === today;
    };

    const isYesterday = (date) => {
        const inputDate = new Date(date).toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return inputDate === yesterday.toISOString().split('T')[0];
    };

    const isThisWeek = (date) => {
        const today = new Date();
        const msgDate = new Date(date);
        const diffTime = Math.abs(today - msgDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    const isInRange = (date) => {
        if (!startDate || !endDate) return true;
        const msgDate = new Date(date);
        return msgDate >= new Date(startDate) && msgDate <= new Date(endDate);
    };

    // Apply all filters
    let filteredContacts = contacts;

    // Date filter
    if (filterType === 'today') {
        filteredContacts = filteredContacts.filter(contact => isToday(contact.createdAt));
    } else if (filterType === 'yesterday') {
        filteredContacts = filteredContacts.filter(contact => isYesterday(contact.createdAt));
    } else if (filterType === 'this_week') {
        filteredContacts = filteredContacts.filter(contact => isThisWeek(contact.createdAt));
    } else if (filterType === 'custom_range') {
        filteredContacts = filteredContacts.filter(contact => isInRange(contact.createdAt));
    }

    // Search filter
    if (searchTerm) {
        filteredContacts = filteredContacts.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Reset all filters
    const handleResetFilters = () => {
        setFilterType('all');
        setStartDate('');
        setEndDate('');
        setSearchTerm('');
    };

    return (
        <div className="mx-3 my-4">
            <h2 className="mb-3">Contact Submissions</h2>

            {/* Filter Controls */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
                <div>
                    <div>
                        <button
                            className={`btn ${filterType === 'all' ? 'btn-secondary' : 'btn-outline-secondary'} me-1`}
                            onClick={() => setFilterType('all')}
                        >
                            All
                        </button>
                        <button
                            className={`btn ${filterType === 'today' ? 'btn-secondary' : 'btn-outline-secondary'} me-1`}
                            onClick={() => setFilterType('today')}
                        >
                            Today
                        </button>
                        <button
                            className={`btn ${filterType === 'yesterday' ? 'btn-secondary' : 'btn-outline-secondary'} me-1`}
                            onClick={() => setFilterType('yesterday')}
                        >
                            Yesterday
                        </button>
                        <button
                            className={`btn ${filterType === 'this_week' ? 'btn-secondary' : 'btn-outline-secondary'} me-1`}
                            onClick={() => setFilterType('this_week')}
                        >
                            This Week
                        </button>
                        <button
                            className={`btn ${filterType === 'custom_range' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            onClick={() => setFilterType('custom_range')}
                        >
                            Custom Range
                        </button>
                    </div>

                </div>

                {filterType === 'custom_range' && (
                    <>
                        <div>
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div className="ms-auto">
                    <label className="form-label">Search</label>
                    <input
                        type="text"
                        placeholder="Name or Email"
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <button className="btn btn-secondary" onClick={handleResetFilters}>
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive ">
                <table className="table table-bordered ">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Message</th>
                            <th>Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map((contact, index) => (
                                <tr key={contact._id}>
                                    <td>{index + 1}</td>
                                    <td>{contact.name}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.phone}</td>
                                    <td>{contact.message}</td>
                                    <td>{new Date(contact.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No messages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}