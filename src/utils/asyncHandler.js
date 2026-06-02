// asyncHandler -> HOF (Higher Order Function)
// HOF -> which takes function as argument or returns a function or both

// const asyncHandler = () => {}
// const asyncHandler = (func) = () => {}
// const asyncHandler = (func) = async () => {}

// req: http request
// res: http response
// next: next function

/*
    const registerController = asyncHandler(
        async (req, res, next) => {
            }
    )
*/

// const asyncHandler = (func) => async (req, res, next) => {
//   try {
//     await func(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error),
    );
  };
};
