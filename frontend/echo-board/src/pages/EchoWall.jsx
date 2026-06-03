import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import {
  ChatBubbleLeftRightIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

// Time formatter
const formatTime = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diff = Math.floor((now - postDate) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

  return postDate.toLocaleDateString();
};

// CLEAN PARSER
const parsePost = (text) => {
  if (!text) {
    return {
      title: "",
      subtitle: "",
      content: "",
    };
  }

  let cleaned = text.split("AI Generated Content:")[0];
  cleaned = cleaned.replace(/Title:/g, "").trim();

  const lines = cleaned
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return {
    title: lines[0] || "",
    subtitle: lines[1] || "",
    content: lines.slice(2).join("\n") || "",
  };
};

function EchoWall() {
  const [posts, setPosts] = useState([]);

  const { user: currentUser } = useAuth() || {};

  const navigate = useNavigate();

  // FETCH POSTS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  // DELETE POST
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Delete this post?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prev) =>
        prev.filter((p) => p._id !== postId)
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  // OPEN CHAT
  const openChat = (user) => {
    if (!user?._id) return;

    if (
      String(user._id) ===
      String(currentUser?._id)
    ) {
      return;
    }

    navigate("/echochat", {
      state: {
        selectedUser: user,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white kode-mono-fontStyle">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          EchoWall
        </h1>

        {/* MASONRY */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {posts.length === 0 ? (
            <p className="text-gray-400 text-center">
              No posts yet...
            </p>
          ) : (
            posts.map((post) => {
              const parsed = parsePost(post.text);

              const postUserId =
                typeof post.user === "object"
                  ? post.user?._id
                  : post.user;

              const currentUserId =
                currentUser?._id;

              const isOwner =
                currentUserId &&
                postUserId &&
                String(postUserId) ===
                  String(currentUserId);

              return (
                <div
                  key={post._id}
                  className="
                  break-inside-avoid
                  mb-6
                  rounded-2xl
                  overflow-hidden
                  bg-gradient-to-br
                  from-[#111827]
                  to-[#1f2937]
                  border border-white/10
                  shadow-lg
                  hover:shadow-cyan-500/20
                  hover:-translate-y-1
                  transition duration-300
                "
                >
                  {/* IMAGE FIRST */}
                  {post.image && (
                    <div className="relative">
                      <img
                        src={post.image}
                        alt="post"
                        className="
                        w-full
                        max-h-[420px]
                        object-cover
                      "
                      />

                      {/* TOP RIGHT ACTIONS */}
                      <div
                        className="
                        absolute top-3 right-3
                        flex items-center gap-2
                      "
                      >
                        {/* CHAT ICON */}
                        {!isOwner && (
                          <button
                            onClick={() =>
                              openChat(post.user)
                            }
                            className="
                            bg-black/50
                            backdrop-blur-md
                            p-2
                            rounded-full
                            hover:bg-cyan-600
                            transition
                          "
                            title="Chat"
                          >
                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                          </button>
                        )}

                        {/* DELETE ICON */}
                        {isOwner && (
                          <button
                            onClick={() =>
                              handleDelete(
                                post._id
                              )
                            }
                            className="
                            bg-black/50
                            backdrop-blur-md
                            p-2
                            rounded-full
                            hover:bg-red-600
                            transition
                          "
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-4">
                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-4">
                      <div
                        onClick={() =>
                          openChat(post.user)
                        }
                        className="
                        flex items-center gap-3
                        cursor-pointer group
                      "
                      >
                        <div
                          className="
                          w-10 h-10
                          bg-gradient-to-r
                          from-cyan-500
                          to-blue-500
                          rounded-full
                          flex items-center
                          justify-center
                          text-sm font-bold
                        "
                        >
                          {post.user?.username
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                        </div>

                        <div className="flex flex-col">
                          <span
                            className="
                            text-sm font-semibold
                            group-hover:text-cyan-400
                            transition
                          "
                          >
                            {post.user?.username ||
                              post.user?.email?.split(
                                "@"
                              )[0] ||
                              "User"}
                          </span>

                          <span className="text-xs text-gray-400">
                            {formatTime(
                              post.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      {/* ICONS IF NO IMAGE */}
                      {!post.image && (
                        <div className="flex gap-2">
                          {!isOwner && (
                            <button
                              onClick={() =>
                                openChat(
                                  post.user
                                )
                              }
                              className="
                              p-2 rounded-full
                              bg-cyan-700/30
                              hover:bg-cyan-600
                              transition
                            "
                            >
                              <ChatBubbleLeftRightIcon className="h-5 w-5" />
                            </button>
                          )}

                          {isOwner && (
                            <button
                              onClick={() =>
                                handleDelete(
                                  post._id
                                )
                              }
                              className="
                              p-2 rounded-full
                              bg-red-700/30
                              hover:bg-red-600
                              transition
                            "
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* TITLE */}
                    {parsed.title && (
                      <h2 className="text-xl font-bold text-cyan-400 mb-2">
                        {parsed.title}
                      </h2>
                    )}

                    {/* SUBTITLE */}
                    {parsed.subtitle && (
                      <p className="text-sm text-white mb-3">
                        {parsed.subtitle}
                      </p>
                    )}

                    {/* CONTENT */}
                    {parsed.content && (
                      <p className="text-gray-300 text-sm whitespace-pre-line leading-6">
                        {parsed.content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default EchoWall;