import express from "express";
import { createUrl, deleteLink, getStats, healthz, listLinks, redirect } from "../controller/urlController.js";

const apiRouter = express.Router();

apiRouter.post("/links", createUrl);

apiRouter.get("/links", listLinks);
apiRouter.get("/links/:code", getStats);
apiRouter.get("/healthz", healthz);
apiRouter.get("/:code", redirect);

apiRouter.delete("/links/:code", deleteLink);

export default apiRouter;
