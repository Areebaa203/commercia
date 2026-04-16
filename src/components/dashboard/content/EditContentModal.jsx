"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const EditContentModal = ({ isOpen, onClose, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentType, setContentType] = useState("Article");
  const [status, setStatus] = useState("Published");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (content) {
          setContentType(content.type);
          setStatus(content.status);
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, content]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={clsx(
          "absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={clsx(
          "relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-6 shadow-xl transition-all duration-300",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Edit Content</h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" width="20" />
          </button>
        </div>

        {/* Form */}
        {content && (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">Title</label>
                    <input 
                        type="text" 
                        defaultValue={content.title}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">Type</label>
                    <select 
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    >
                        <option value="Article">Article</option>
                        <option value="Video">Video</option>
                        <option value="Banner">Banner</option>
                        <option value="Product">Product Promotion</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">Status</label>
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                    </select>
                </div>
            </div>

            {/* Conditional Video Upload Field */}
            {contentType === "Video" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="text-xs font-medium text-gray-700">Video URL / Upload</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            defaultValue={content.videoUrl}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                        />
                        <button 
                            type="button" 
                            className="shrink-0 flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            title="Upload Video"
                        >
                            <Icon icon="mingcute:upload-2-line" width="20" />
                        </button>
                    </div>
                </div>
            )}

            {/* Conditional Schedule Fields */}
            {status === "Scheduled" && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Publish Date</label>
                        <input 
                            type="date" 
                            defaultValue={content.publishDate}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-600"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-700">Publish Time</label>
                        <input 
                            type="time" 
                            defaultValue={content.publishTime}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-600"
                        />
                    </div>
                </div>
            )}

            <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">Author</label>
                    <input 
                        type="text" 
                        defaultValue={content.author}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">Description</label>
                    <textarea 
                        rows="3"
                        defaultValue={content.description}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400 resize-none"
                    ></textarea>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">Thumbnail URL</label>
                    <div className="flex gap-3">
                         <input 
                            type="text" 
                            defaultValue={content.thumbnail}
                            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                        />
                         <div className="h-10 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                            <img src={content.thumbnail} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default EditContentModal;
