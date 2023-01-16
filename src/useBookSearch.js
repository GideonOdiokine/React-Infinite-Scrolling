import { useEffect, useState } from "react";
import axios from "axios";

export default function useBookSearch(query, pageNumber) {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);
	const [books, setBooks] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setBooks([]);
	}, [query]);

	useEffect(() => {
		setIsLoading(true);
		setError(false);
		let cancel;
		axios({
			method: "GET",
			url: "http://openlibrary.org/search.json",
			params: { q: query, page: pageNumber },
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				// console.log(res.data);
				setBooks((prev) => {
					return [...new Set([...prev, ...res.data.docs.map((b) => b.title)])];
				});
				setIsLoading(false);
				setHasMore(res.data.docs.length > 0);
				setError(false);
			})
			.catch((e) => {
				if (axios.isCancel(e)) return;
				setIsLoading(false);
				setError(true);
			});

		return () => cancel();
	}, [query, pageNumber]);
	return { books, isLoading, error, hasMore };
}
