/**
 *
 * @param {number} time - How much time have to sleep
 * @param {string} unit - Unit of time ['s'-seconds,'m'-minute,'h'-houre]
 */
export const sleep = (time, unit) => new Promise((resolve) => {
	const ms = unit === 's' ? time * 1000 : unit === 'm' ? time * 60 * 1000 : unit === 'h' ? time * 60 * 60 * 1000 : time;
	setTimeout(() => resolve(), ms);
});