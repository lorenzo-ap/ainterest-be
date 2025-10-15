export const getRapidAPIHeaders = (host) => {
	return {
		'x-rapidapi-key': process.env.RAPIDAPI_KEY,
		'x-rapidapi-host': host,
		'Content-Type': 'application/json'
	};
};
