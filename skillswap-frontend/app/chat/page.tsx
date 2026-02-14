'use client';
import React, { useState } from "react";
import MessageChatBox from "@/component/messagechatbox";

const Page = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const demoUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Mike Johnson" },
  ];

  const openChat = (user: { id: number; name: string }) => {
    setSelectedUser(user);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        
        <div className="space-y-2">
          {demoUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
              onClick={() => openChat(user)}
            >
              <p className="font-medium">{user.name}</p>
            </div>
          ))}
        </div>
      </div>

      {isChatOpen && selectedUser && (
        <MessageChatBox
          user={selectedUser}
          onClose={closeChat}
        />
      )}
    </div>
  );
};

export default Page;