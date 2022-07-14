import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import gsap from 'gsap';

// User Story #6: On first load, my quote machine displays a random quote in the element with id="text".

// User Story #7: On first load, my quote machine displays the random quote's author in the element with id="author".

// User Story #8: When the #new-quote button is clicked, my quote machine should fetch a new quote and display it in the #text element.

// User Story #9: My quote machine should fetch the new quote's author when the #new-quote button is clicked and display it in the #author element.

// User Story #10: I can tweet the current quote by clicking on the #tweet-quote a element. This a element should include the "twitter.com/intent/tweet" path in its href attribute to tweet the current quote.

// User Story #11: The #quote-box wrapper element should be horizontally centered. Please run tests with browser's zoom level at 100% and page maximized.

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, quotes: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
const colors = [
  '#16a085',
  '#27ae60',
  '#2c3e50',
  '#f39c12',
  '#e74c3c',
  '#9b59b6',
  '#FB6964',
  '#342224',
  '#472E32',
  '#BDBB99',
  '#77B1A9',
  '#73A857'
];
let color = colors[Math.floor(Math.random() * colors.length)];

function App() {
  const [{ quotes, loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: ''
  });

  const fetchUrl =
    'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';
  const [quoteNumber, setQuoteNumber] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(fetchUrl);
        setQuoteNumber(Math.floor(Math.random() * data.quotes.length - 1));
        dispatch({ type: 'FETCH_SUCCESS', payload: data.quotes });
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: err });
      }
    };
    document.body.style.background = color;
    fetchQuotes();
  }, []);

  const getNewQuoteHandler = () => {
    let newQuote;
    do newQuote = Math.floor(Math.random() * quotes.length);
    while (quotes[newQuote].quote === 'undefined');
    let newColor = colors[Math.floor(Math.random() * colors.length)];
    setQuoteNumber(newQuote);

    let anim = gsap.timeline();
    anim.to('#text, #author, #tweet-quote, .fa-quote-left, .fa-twitter', {
      opacity: 0
    });

    anim.to('#text, #author, #tweet-quote, .fa-quote-left, .fa-twitter', {
      opacity: 1,
      color: newColor
    });
    anim.to('#new-quote', { backgroundColor: newColor }, '<');
    anim.to(document.body, { backgroundColor: newColor }, '<');
  };

  return loading ? (
    <div>loading...</div>
  ) : error ? (
    <div>loading...</div>
  ) : (
    <div
      id="quote-box"
      className="d-flex flex-column align-items-center container"
    >
      <div className="p-5" style={{ backgroundColor: 'white' }}>
        <div className="quote-text mb-2">
          <i style={{ color: color }} className="fas fa-quote-left"></i>
          <span style={{ color: color }} id="text">
            {' '}
            {quotes[quoteNumber].quote}
          </span>
        </div>
        <div
          className="w-100 text-end mb-2"
          style={{ color: color }}
          id="author"
        >
          {' '}
          - {quotes[quoteNumber].author}
        </div>
        <div className="d-flex justify-content-between">
          <a href="twitter.com/intent/tweet" id="tweet-quote">
            <i style={{ color: color }} className="fab fa-twitter"></i>
          </a>
          <button
            id="new-quote"
            style={{
              borderRadius: '5px',
              color: 'white',
              border: 'none',
              backgroundColor: color
            }}
            onClick={getNewQuoteHandler}
          >
            {' '}
            New Quote{' '}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
