import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/api/users', {
        name,
        email,
        password,
      });
      console.log(response.data);
      setUsers([...users, response.data]);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Error creating user');
    }
  };

  const handleEdit = (user) => {
    setEditing(true);
    setCurrentUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/users/${currentUser._id}`, {
        name,
        email,
        password,
      });
      console.log(response.data);
      setUsers(users.map((user) => user._id === currentUser._id ? response.data : user));
      setEditing(false);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Error updating user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Join the waitlist</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="password"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Join the waitlist
        </button>
        {editing ? (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
            type="button"
            onClick={handleUpdate}
          >
            Update
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            type="button"
            onClick={() => handleEdit(currentUser)}
          >
            Edit
          </button>
        )}
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
          type="button"
          onClick={() => handleDelete(currentUser._id)}
        >
          Delete
        </button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrationForm;