import React from 'react';
import {useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';

const MentionText = ({text, className = ''}) => {
    const navigate = useNavigate();

    const parseMentions = (text) => {
        if (!text) return [];

        const mentionRegex = /@([0-9A-Za-z가-힣_]+)/g;

        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = mentionRegex.exec(text)) !== null) {
            const start = match.index;

            if (start > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.substring(lastIndex, start),
                });
            }

            parts.push({
                type: 'mention',
                content: match[0],
                username: match[1],
            });

            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.substring(lastIndex),
            });
        }

        return parts;
    };


    const handleMentionClick = async (username, e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const user = await apiService.getUserByUsername(username);
            if (user && user.userId) {
                navigate(`/user/feed/${user.userId}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const parts = parseMentions(text);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                if (part.type === 'mention') {
                    return (
                        <span
                            key={index}
                            className="mention-link"
                            onClick={(e) => handleMentionClick(part.username, e)}
                            style={{
                                color: '#0095f6',
                                background: '#d8efff',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            {part.content}
                        </span>
                    );
                }
                return <span key={index}>{part.content}</span>;
            })}
        </span>
    );
};

export default MentionText;