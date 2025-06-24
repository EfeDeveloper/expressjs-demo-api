const LoggerMiddleWare = (req, res, next) => {
  const timeStamp = new Date().toISOString();

  console.log(
    `Logger: ${timeStamp} - Method: ${req.method} - URL: ${req.url} - IP: ${req.ip}`
  );

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `Logger: ${timeStamp} - Response: ${res.statusCode} - Duration: ${duration}ms`
    );
  });
  next();
};

module.exports = LoggerMiddleWare;
