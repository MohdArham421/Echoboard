import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EchoAI() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    prompt: "",
    image: null,
  });

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, image: file });
  };

  // 🔥 REAL AI GENERATE (Gemini Backend)
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert("Title is required for AI generation");
      return;
    }

    try {
      setLoading(true);
      setResponse("");

      const res = await axios.post(
        "http://localhost:5000/api/ai/generate",
        {
          title: formData.title,
          subtitle: formData.subtitle,
          prompt: formData.prompt,
        }
      );

      setResponse(res.data.content);

    } catch (error) {
      console.error(error);
      alert("AI generation failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // POST TO BACKEND
  const handlePost = async () => {
    try {
      setPosting(true);

      let finalContent = "";

      // AI content priority
      if (response) {
        finalContent = response;
      } else {
        // fallback manual content
        if (formData.title) finalContent += `${formData.title}\n`;
        if (formData.subtitle) finalContent += `${formData.subtitle}\n`;
        if (formData.prompt) finalContent += `${formData.prompt}\n`;
      }

      if (!finalContent.trim()) {
        alert("Nothing to post!");
        return;
      }

      const data = new FormData();
      data.append("text", finalContent);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/posts", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // RESET
      setFormData({
        title: "",
        subtitle: "",
        prompt: "",
        image: null,
      });

      setResponse("");

      alert("Posted successfully 🚀");
      navigate("/echowall");

    } catch (error) {
      console.error(error);
      alert("Post failed ❌");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#0f172a] to-black text-white kode-mono-fontStyle">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center text-cyan-400">
          ✨ EchoAI Content Generator
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleGenerate}
          className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow space-y-4"
        >
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title (required)"
            className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/20 focus:border-cyan-500 outline-none"
          />

          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Subtitle (optional)"
            className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/20 focus:border-cyan-500 outline-none"
          />

          <textarea
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            placeholder="Extra prompt (tone, style, audience...)"
            className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/20 focus:border-cyan-500 outline-none"
            rows={3}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-300"
          />

          {/* GENERATE BUTTON */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold 
            bg-gradient-to-r from-cyan-500 to-blue-500 
            hover:opacity-90 transition"
          >
            {loading ? "Generating..." : "✨ Generate with AI"}
          </button>
        </form>

        {/* AI OUTPUT */}
        {response && (
          <div className="p-5 border border-white/10 rounded-xl bg-white/5 shadow">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">
              AI Generated Content
            </h3>

            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full bg-transparent text-gray-200 text-sm whitespace-pre-line outline-none"
              rows={8}
            />
          </div>
        )}

        {/* POST BUTTON */}
        {(response || formData.title || formData.prompt) && (
          <button
            onClick={handlePost}
            disabled={posting}
            className="w-full py-3 rounded-xl font-semibold 
            bg-green-600 hover:bg-green-500 transition"
          >
            {posting ? "Posting..." : "🚀 Post to EchoWall"}
          </button>
        )}
      </div>
    </div>
  );
}

export default EchoAI;