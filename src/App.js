import { useState, useRef, useCallback } from "react";
import "./App.css";
import useBookSearch from "./useBookSearch";

function App() {
	const [query, setQuery] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const { books, hasMore, isLoading, error } = useBookSearch(query, pageNumber);

	const observer = useRef();
	const lastBookElementRef = useCallback(
		(node) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => prevPageNumber + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore]
	);
	const handleSearch = (e) => {
		setQuery(e.target.value);
		setPageNumber(1);
	};
	return (
		<>
			<input type='text' value={query} onChange={handleSearch} />
			{books.map((book, index) => {
				if (book.length === index + 1) {
					return (
						<div ref={lastBookElementRef} key={book}>
							{book}
						</div>
					);
				} else {
					return <div key={book}>{book}</div>;
				}
			})}
			<div>{isLoading && "Loading....."}</div>
			<div>{error && "Error"}</div>
		</>
	);
}

export default App;
