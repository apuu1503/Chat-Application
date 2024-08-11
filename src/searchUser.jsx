// src/SearchUsers.js
import React, { useState } from 'react';
import axios from 'axios';

const SearchUsers = ({ onSelectUser }) => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/rooms/search', { params: { query } });
            setUsers(response.data);
        } catch (error) {
            alert('Search failed');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users"
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {users.map((user) => (
                    <li key={user._id} onClick={() => onSelectUser(user)}>
                        {user.name} ({user.username})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchUsers;
