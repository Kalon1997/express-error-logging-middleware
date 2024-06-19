# express-error-logging-middleware
npm package for express error logging middleware, storing errors in server and pin-pointing the troubled api.

1. It is a middleware compatible with express framework, needs to be placed as middleware in route function after the controller call.
2. Stores all 400 and 500 errors on server that are passed as next(err) or next(new Error()) way.
3. And helps into troubleshooting apis by finding which api has logged most errors.

# How to pass as middleware?
const { errorLoggingMiddleware } = require("../error-logging-middleware");
 getRoutes(){
     this.route.get("/get", (req, res, next) => {
      this.controller.someController(req, res, next)
    },errorLoggingMiddleware);
  }

# How to pass err in next()
next(error);
or
next(new Error("err"))

 - error can be array or string

# Functions
# 1 
getLatestErrors(statusType, countFromLast)
statusType can be 4XX or 5XX
countFromLast is an integer. 

eg. getLatestErrors(404, 10);
Will return the list of lastest 10 errors of statusCode 4XX, that has occured in the application.

# 2
getApiWithMostError(statusType)
statusType can be 4XX or 5XX

eg. getApiWithMostError(500);
Will return the api name and its error count of type 5XX.
For example ['v1/api/get', 20]
means, 'v1/api/get' api encountered 5XX error the highest number of times compared to any other api, and the count is 20.