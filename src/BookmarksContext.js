import React from 'react';

const BookmarksContext = React.createContext({
    bookmarks: [],
    addBookMark: () => {},
    deleteBookmark: () => {},
    editBookmark: () => {},
})

export default BookmarksContext;