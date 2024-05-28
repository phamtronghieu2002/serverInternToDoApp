import authRoute from "./authRoute";

const initApiRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
};

export default initApiRoutes;
