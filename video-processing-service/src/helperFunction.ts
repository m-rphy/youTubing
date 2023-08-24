

// helper function to create fileController error objects
// return value will be the object we pass into next, invoking global error handler
export const createErr = (errInfo: any) => {
    const { method, status, err, message } = errInfo;
    return { 
      log: `fileController.${method} ${status}: ERROR: ${err}`,
      message: message,
      status,
      err
    };
  };