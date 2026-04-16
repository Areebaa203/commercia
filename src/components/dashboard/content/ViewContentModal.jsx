"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const ViewContentModal = ({ isOpen, onClose, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
          <h3 className="text-lg font-bold text-gray-900">Content Preview</h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mingcute:close-line" width="20" />
          </button>
        </div>

        {/* Content */}
        {content && (
            <div className="space-y-6">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                    <img src={content.thumbnail} alt={content.title} className="h-full w-full object-cover" />
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", 
                                content.status === "Published" ? "bg-green-100 text-green-700" : 
                                content.status === "Draft" ? "bg-gray-100 text-gray-700" : 
                                "bg-blue-100 text-blue-700"
                            )}>
                                {content.status}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{content.type}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{content.date}</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{content.title}</h4>
                        <p className="text-sm text-gray-600 mt-2">{content.description}</p>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400">
                            <Icon icon="mingcute:user-3-line" width="20" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Author</p>
                            <p className="text-sm font-medium text-gray-900">{content.author}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg border border-gray-100 bg-white text-center">
                            <div className="flex justify-center text-blue-500 mb-1">
                                <Icon icon="mingcute:eye-2-line" width="20" />
                            </div>
                            <span className="block text-lg font-bold text-gray-900">{content.views}</span>
                            <span className="text-xs text-gray-500">Views</span>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-100 bg-white text-center">
                            <div className="flex justify-center text-green-500 mb-1">
                                <Icon icon="mingcute:thumb-up-2-line" width="20" />
                            </div>
                            <span className="block text-lg font-bold text-gray-900">{content.likes}</span>
                            <span className="text-xs text-gray-500">Likes</span>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-100 bg-white text-center">
                            <div className="flex justify-center text-purple-500 mb-1">
                                <Icon icon="mingcute:chat-2-line" width="20" />
                            </div>
                            <span className="block text-lg font-bold text-gray-900">{content.comments}</span>
                            <span className="text-xs text-gray-500">Comments</span>
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ViewContentModal;
