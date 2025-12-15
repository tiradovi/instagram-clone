import React, {useState, useRef, useEffect} from 'react';
import apiService from '../service/apiService';
import {getImageUrl} from "../service/commonService";

const MentionInput = ({value, onChange, placeholder, rows = 4}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const textareaRef = useRef(null);
    const suggestionsRef = useRef(null);
    const highlightRef = useRef(null);

    const searchUsers = async (query) => {
        if (!query || query.length < 1) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await apiService.searchUsers(query);
            setSuggestions(response || []);
        } catch (error) {
            console.error("유저 검색 실패", error);
            setSuggestions([]);
            setSelectedIndex(0);
        }
    };

    const handleTextChange = (e) => {
        const newValue = e.target.value;
        const newCursorPosition = e.target.selectionStart;

        onChange(newValue);
        setCursorPosition(newCursorPosition);

        const textBeforeCursor = newValue.substring(0, newCursorPosition);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');

        if (lastAtIndex !== -1) {
            const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

            if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
                setShowSuggestions(true);
                searchUsers(textAfterAt);
                setSelectedIndex(0);
            } else setShowSuggestions(false);
        } else setShowSuggestions(false);
    };

    const selectUser = (user) => {
        const textBeforeCursor = value.substring(0, cursorPosition);
        const textAfterCursor = value.substring(cursorPosition);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');

        if (lastAtIndex !== -1) {
            const beforeAt = textBeforeCursor.substring(0, lastAtIndex);
            const newValue = `${beforeAt}@${user.userName} ${textAfterCursor}`;
            const newCursorPosition = beforeAt.length + user.userName.length + 2;

            onChange(newValue);
            setShowSuggestions(false);
            setSuggestions([]);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
                }
            })
        }
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => prev < suggestions.length - 1 ? prev + 1 : 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => prev > 0 ? prev - 1 : suggestions.length - 1);
                break;
            case 'Enter':
                if (showSuggestions && suggestions[selectedIndex]) {
                    e.preventDefault();
                    selectUser(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const highlightMentions = (text) => {
        const mentionRegex = /@([0-9A-Za-z가-힣_]+)/g;

        const parts = [];
        let lastIndex = 0;
        let match;

        while((match = mentionRegex.exec(text)) !== null) {
            if(match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            parts.push(
                <span key={match.index} style={{color:'#0095f6', fontWeight:'600'}}>
                    {match[0]}
                </span>
            )
            lastIndex = match.index + match[0].length;
        }
        if(lastIndex <text.length) {
            parts.push(text.substring(lastIndex));
        }
        return parts;
    }
    return (
        <div style={{position: 'relative', width: '100%'}}>
            <div
                ref={highlightRef}
                className="upload-caption-input"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    color: 'transparent',
                    pointerEvents: 'none',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    background: 'transparent',
                    border: '1px solid transparent',
                }}>
                <span style={{color: '#000'}}>{highlightMentions(value)}</span>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={rows}
                className="upload-caption-input"
                style={{
                    position: 'relative',
                    background: 'transparent',
                    color: 'transparent',
                    caretColor: '#000'
                }}
            />

            {
                showSuggestions && suggestions.length > 0 && (
                    <div
                        ref={suggestionsRef}
                        className="mention-suggestions"
                    >
                        {suggestions.map((user, index) => (
                            <div
                                key={user.userId}
                                className={`mention-item ${index === selectedIndex ? 'selected' : ''}`}
                                onClick={() => selectUser(user)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <img
                                    src={getImageUrl(user.userAvatar) || '/static/img/default-avatar.jpg'}
                                    alt={user.userName}
                                    className="mention-avatar"
                                />
                                <div className="mention-info">
                                    <div className="mention-username">{user.userName}</div>
                                    {user.userFullname && (
                                        <div className="mention-fullname">{user.userFullname}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
        ;
};

export default MentionInput;