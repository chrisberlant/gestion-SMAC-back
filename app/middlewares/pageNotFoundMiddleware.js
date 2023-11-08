const middleware404 = (req, res) => {
	res.status(404).send('404');
};

export default middleware404;
