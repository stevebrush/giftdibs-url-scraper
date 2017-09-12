module.exports = (err, req, res, next) => {
  const statusCode = err.status || 404;
  const result = {
    message: err.message,
    code: err.code || 0
  };

  res.status(statusCode).json(result);
};
