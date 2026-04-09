const AppError = require("../exceptions/base.exception.js");

const exceptionsHandler = (err, req,res, next) =>{
  
   //Log del error para debugging
  console.error('❌ Error capturado:', {
    message: err.message,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method
  });

  if(err.isOperational){
      return res.status(err.statusCode).json({
          success: false,
          error: {
            message: err.message,
            statusCode: err.statusCode
          }
      });
  }

  return res.status(500).json({
          success: false,
          error: {
            message: "Error interno del servidor",
            statusCode: 500
          }
  });

}

const routeNotFoundHandler = (req, res, next) => {
    const error = new AppError(`Ruta ${req.method} ${req.path} no encontrada`, 404);
    next(error);
}

module.exports = {
    exceptionsHandler,
    routeNotFoundHandler
}