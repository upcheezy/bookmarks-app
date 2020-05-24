import React, { Component } from "react";
import BookmarksContext from "../BookmarksContext";
import config from "../config";

const Required = () => <span className="AddBookmark__required">*</span>;

export default class EditBookmark extends Component {
  state = {
    error: null,
    title: '',
    url: '',
    description: '',
    rating: 0
  };

  handleClickCancel = () => {
    this.props.history.push("/");
  };

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // get the form fields from the event
    const { title, url, description, rating } = e.target;
    const bookmark = {
      title: title.value,
      url: url.value,
      description: description.value,
      rating: rating.value,
    };
    this.setState({ error: null });
    fetch(
      `${config.API_ENDPOINT}/${this.props.match.params.bookmark_id}`,
      {
        method: "PATCH",
        body: JSON.stringify(bookmark),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${config.API_KEY}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then((error) => {
            // then throw it
            throw error;
          });
        }
      })
      .then(() => {
        this.props.history.push("/");
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error });
      });
    //   console.log(this.context);
  };

  render() {
    console.log(this.context);
    const { error } = this.state;
    return (
      <section className="AddBookmark">
        <h2>Edit bookmark</h2>
        <BookmarksContext.Consumer>
          {(value) => {
            const bookmark = value.bookmarks.find(
              (book) =>
                book.id === parseInt(this.props.match.params.bookmark_id, 10)
            );
            //   console.log(value);
            //   console.log(this.props.match);
            //   console.log(bookmark)
            return (
              <form className="EditBookmark__form" onSubmit={(e) => {
                console.log(e);
                e.preventDefault()
                this.handleSubmit(e)
                console.log(value);
                value.editBookmark(this.state);
              } }>
                <div className="EditBookmark__error" role="alert">
                  {error && <p>{error.message}</p>}
                </div>
                <div>
                  <label htmlFor="title">
                    Title <Required />
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder={bookmark ? bookmark.title : "some string"}
                    onChange={this.handleInput}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="url">
                    URL <Required />
                  </label>
                  <input
                    type="url"
                    name="url"
                    id="url"
                    placeholder={bookmark ? bookmark.url : "some string"}
                    onChange={this.handleInput}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    placeholder={
                      bookmark ? bookmark.description : "some string"
                    }
                    onChange={this.handleInput}
                  />
                </div>
                <div>
                  <label htmlFor="rating">
                    Rating <Required />
                  </label>
                  <input
                    type="number"
                    name="rating"
                    id="rating"
                    defaultValue={bookmark ? bookmark.rating : "some string"}
                    min="1"
                    max="5"
                    placeholder={bookmark ? bookmark.rating : "some string"}
                    onChange={this.handleInput}
                    required
                  />
                </div>
                <div className="AddBookmark__buttons">
                  <button type="button" onClick={this.handleClickCancel}>
                    Cancel
                  </button>{" "}
                  <button type="submit">Save</button>
                </div>
              </form>
            );
          }}
        </BookmarksContext.Consumer>
      </section>
    );
  }
}
