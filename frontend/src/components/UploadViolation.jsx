import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadViolation() {
  const [form, setForm] = useState({
    type: '',
    plate: '',
    time: '',
    date: '',
    violation: '',
    photo: null
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm((prevForm) => ({ ...prevForm, photo: files[0] }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.photo) {
      alert("Please upload a photo!");
      return;
    }

    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("plate", form.plate);
    formData.append("time", form.time);
    formData.append("date", form.date);
    formData.append("violation", form.violation);
    formData.append("photo", form.photo);

    try {
      const response = await fetch('http://localhost:5000/api/violations', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      alert('Violation uploaded successfully!');
      navigate('/dashboard');

    } catch (error) {
      console.error('Error uploading violation:', error);
      alert(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
          Upload Violation
        </h2>

        <input
          type="text"
          name="type"
          placeholder="Type of Vehicle"
          value={form.type}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg"
          required
        />

        <input
          type="text"
          name="plate"
          placeholder="Number Plate"
          value={form.plate}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg"
          required
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg"
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg"
          required
        />

        <input
          type="text"
          name="violation"
          placeholder="Rule Violation"
          value={form.violation}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg"
          required
        />

        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadViolation;
