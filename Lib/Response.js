const success = (message, data) => {
    return { message: message ?? "success", data: data };
  };
  
  const error = (error) => {
    return { message: error.message, data: null };
  };
  
  const successResponse = (res, data) => {
    const response = { message: "success" };
    if (data) response.data = data;
    return res.status(200).json(response);
  };
  
  const errorResponse = (res, error) => {
    return res.status(500).json({ message: error.message });
  };

  module.exports = {
    success,
    error,
    successResponse,
    errorResponse,
  };