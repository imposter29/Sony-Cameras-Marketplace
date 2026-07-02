// Wrap an async route handler so any rejected promise is forwarded to the
// centralized errorHandler instead of hanging the request. Lets new controllers
// skip the repetitive try/catch boilerplate.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
