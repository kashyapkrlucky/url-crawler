import React, { useState } from "react";
import axios from "../../lib/axios";

interface UrlFormProps {
  onSuccess: (addedUrls: any) => void;
}

const UrlForm: React.FC<UrlFormProps> = ({ onSuccess }) => {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Split input by commas and newlines, then trim and filter empty
    const urls = input
      .split(/[\n,]+/) // split by newline or comma
      .map((u) => u.trim())
      .filter(Boolean);

    setIsSubmitting(true);

    try {
      let res;
      if (urls.length === 1) {
        res = await axios.post("/add-url", { url: urls[0] });
      } else {
        res = await axios.post("/add-url", { urls });
      }
      onSuccess(res.data.urls);
      setInput("");
    } catch (err) {
      console.error("Error adding URLs:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6 text-center ">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Enter URL(s) (comma separated or one per line):
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        className="w-full bg-white shadow-sm rounded-xl p-6 font-mono focus:outline-blue-600 focus:ring"
        placeholder="https://example.com"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default UrlForm;
