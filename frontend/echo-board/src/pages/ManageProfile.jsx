import React, { useState, useEffect } from 'react';
import { updateProfile } from "../api/profile.api";
import { EyeIcon, EyeSlashIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Navbar from '../components/Navbar';

function ManageProfile() {
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  gender: '',
  dob: '',
  professions: [],
});

const professionOptions = [
  "Developer",
  "Writer",
  "Poet",
  "Designer",
  "Photographer",
  "Musician",
  "Student",
  "Entrepreneur",
  "Content Creator",
  "AI Enthusiast",
];

  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [age, setAge] = useState('');

  useEffect(() => {
    if (formData.dob) {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    }
  }, [formData.dob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfessionChange = (profession) => {
  const updatedProfessions = formData.professions.includes(profession)
    ? formData.professions.filter((p) => p !== profession)
    : [...formData.professions, profession];

  setFormData({
    ...formData,
    professions: updatedProfessions,
  });
};
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await updateProfile(formData);
    alert("Profile updated successfully!");
  } catch (error) {
    console.log(error);
    alert("Failed to update profile");
  }
};


  return (
    <div className="min-h-screen bg-[#0d1117] kode-mono-fontStyle">
      <Navbar />

      <div className="flex justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/10 space-y-6"
        >
          <h2 className="text-2xl font-bold text-white text-center">Manage Profile</h2>

          <div className="flex flex-col items-center">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-2 border border-white/20"
              />
            ) : (
              <UserCircleIcon className="w-24 h-24 text-gray-400 mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 block w-full rounded-lg px-3 py-2 bg-white/10 text-white border border-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-lg px-3 py-2 bg-white/10 text-white border border-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="block w-full rounded-lg px-3 py-2 bg-white/10 text-white border border-gray-600 focus:outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg px-3 py-2 bg-white/10 text-white border border-gray-600 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option className="text-black" value="male">Male</option>
              <option className="text-black" value="female">Female</option>
              <option className="text-black" value="other">Other</option>
            </select>
          </div>

 <div>
  <label className="text-sm font-medium text-gray-300">
    Profession
  </label>

  <select
    name="profession"
    onChange={(e) =>
      setFormData({
        ...formData,
        professions: [e.target.value],
      })
    }
    className="mt-1 block w-full rounded-lg px-3 py-2 bg-white/10 text-white border border-gray-600 focus:outline-none"
  >
    <option value="">Select Profession</option>

    <option className="text-black" value="Developer">
      Developer
    </option>

    <option className="text-black" value="Writer">
      Writer
    </option>

    <option className="text-black" value="Poet">
      Poet
    </option>

    <option className="text-black" value="Designer">
      Designer
    </option>

    <option className="text-black" value="Student">
      Student
    </option>

    <option className="text-black" value="Musician">
      Musician
    </option>
  </select>
</div>

          <div>
            <label className="text-sm font-medium text-gray-300">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg px-3 py-2 bg-white/10 text-white border border-gray-600 focus:outline-none"
            />
            {age && (
              <p className="text-gray-400 mt-1">Age: {age} years</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white font-semibold rounded-lg bg-cyan-700 hover:bg-cyan-600 transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManageProfile;
