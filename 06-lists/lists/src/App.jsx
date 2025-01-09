import React from 'react';
import axios from 'axios';

import './App.css'

/* eslint-disable react/prop-types */

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const getAsyncStories = (url) =>
  axios.get(url);

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};

const App = () => {


  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  //React’s useCallback Hook creates a memoized function every time its dependency array (E) changes
  const handleFetchStories = React.useCallback(async () => {

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await getAsyncStories(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });

    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }

  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const searchedStories = stories.data.filter((story) =>
    story.title?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const handleRemoveStory = (item) => {
    console.log('handleRemoveStory', item)
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };


  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => {
  return (
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel
        id="search"
        label="Search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button
        type="submit"
        disabled={!searchTerm}
      >
        Submit
      </button>
    </form>
  );
};
const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map(item => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);
const Item = ({ item, onRemoveItem }) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}> {/* onClick={onRemoveItem.bind(null, item)} */}
          Dismiss
        </button>
      </span>
    </li>
  );
}

class InputWithLabel extends React.Component {

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.isFocused) {
      this.inputRef.current.focus();
    }
  }

  render() {
    const {
      id,
      value,
      type = 'text',
      onInputChange,
      children,
    } = this.props;
    return (
      <>
        <label htmlFor={id}>{children}</label>
        &nbsp;
        <input
          ref={this.inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onInputChange}
        />
      </>
    );
  }
}

export default App;