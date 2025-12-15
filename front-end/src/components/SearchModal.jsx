import React, {useState, useEffect, useRef} from 'react';
import {X, Search} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';
import {getImageUrl} from '../service/commonService';

const SearchModal = ({isOpen, onClose}) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem('recentSearches');
            if (saved) {
                setRecentSearches(JSON.parse(saved));
            }
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);


    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery == null) {
                setSearchResults([]);
                return;
            }
            try {
                setIsLoading(true);
                const response = await apiService.searchUsers(searchQuery);
                setSearchResults(response || []);
            } catch (error) {
                console.log(error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };
        const debounceTimer = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);


    const handleUserClick = (user) => {
        const newRecent = [
            user,
            ...recentSearches.filter(u => u.userId !== user.userId)
        ].slice(0, 10);
        setRecentSearches(newRecent);
        localStorage.setItem('recentSearches', JSON.stringify(newRecent));
        navigate(`/user/feed/${user.userId}`);
        onClose();

    };


    const removeRecentSearch = (userId, e) => {
        e.stopPropagation();
        const filtered = recentSearches.filter(u => u.userId !== userId);
        setRecentSearches(filtered);
        localStorage.setItem('recentSearches', JSON.stringify(filtered));

    };


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="search-modal-overlay" onClick={handleOverlayClick}>
            <div className="search-modal-content">
                <div className="search-modal-header">
                    <h2 className="search-modal-title">검색</h2>
                    <X
                        size={24}
                        className="search-modal-close"
                        onClick={onClose}
                    />
                </div>

                <div className="search-input-wrapper">
                    <Search size={20} className="search-input-icon"/>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-modal-input"
                    />
                    {searchQuery && (
                        <X
                            size={16}
                            className="search-clear-icon"
                            onClick={() => setSearchQuery('')}
                        />
                    )}
                </div>

                <div className="search-results-container">
                    {searchQuery.trim() === '' ? (
                        <>
                            {recentSearches.length > 0 && (
                                <>
                                    <div className="search-section-header">
                                        <span className="search-section-title">최근 검색 항목</span>
                                    </div>
                                    {recentSearches.map((user) => (
                                        <div
                                            key={user.userId}
                                            className="search-result-item"
                                            onClick={() => handleUserClick(user)}
                                        >
                                            <img
                                                src={getImageUrl(user.userAvatar)}
                                                alt={user.userName}
                                                className="search-result-avatar"
                                            />
                                            <div className="search-result-info">
                                                <div className="search-result-username">{user.userName}</div>
                                                <div className="search-result-fullname">{user.userFullname}</div>
                                            </div>
                                            <X
                                                size={16}
                                                className="search-remove-icon"
                                                onClick={(e) => removeRecentSearch(user.userId, e)}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                            {recentSearches.length === 0 && (
                                <div className="search-empty">
                                    <p>최근 검색 내역이 없습니다.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {isLoading ? (
                                <div className="search-loading">검색 중...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((user) => (
                                    <div
                                        key={user.userId}
                                        className="search-result-item"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <img
                                            src={getImageUrl(user.userAvatar)}
                                            alt={user.userName}
                                            className="search-result-avatar"
                                        />
                                        <div className="search-result-info">
                                            <div className="search-result-username">{user.userName}</div>
                                            <div className="search-result-fullname">{user.userFullname}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="search-empty">
                                    <p>검색 결과가 없습니다.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;

