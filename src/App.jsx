import React, { Component } from "react";
import { Route } from "react-router-dom";
import AddBookmark from "./AddBookmark/AddBookmark";
import BookmarkList from "./BookmarkList/BookmarkList";
import Nav from "./Nav/Nav";
import config from "./config";
import "./App.css";
import BookmarksContext from "./BookmarksContext";
import Rating from './Rating/Rating';
import EditBookmark from "./EditBookmark/EditBookmark";

class App extends Component {
  state = {
    bookmarks: [],
    error: null
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null
    });
  };

  // todo find index using map bookmarkId matches new id. Use .splice(index, number of elements, what you are replacing it with)
  // take a look here something is incorrect. Use splice method instead.
  editBookmark = newBookmark => {
    const newBookmarks = this.state.bookmarks.map(art =>
     (art.id === newBookmark.id) ? newBookmark : art
   )
   console.log(newBookmarks);
   this.setState({
     bookmarks: newBookmarks
   })
 };


  addBookmark = bookmark => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark]
    });
  };

  deleteBookmark = bookmarkId => {
    console.log(bookmarkId)
    // todo: remove bookmark with bookmarkId from state
    const newBookmarks = this.state.bookmarks.filter(bm =>
      bm.id !== bookmarkId
    )
    this.setState({
      bookmarks: newBookmarks
    })
  }

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }));
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      editBookmark: this.editBookmark
    };
    return (
      <main className="App">
        <h1>Bookmarks!</h1>
        <Rating />
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className="content" aria-live="polite">
            <Route
              path="/add-bookmark"
              component={AddBookmark}
            />
            <Route
              exact
              path="/"
              component={BookmarkList}
            />
            <Route
              path="/edit-bookmark/:bookmark_id"
              component={EditBookmark}
              // render={() => <EditBookmark editBookmark={this.editBookmark}/>}
            />
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
