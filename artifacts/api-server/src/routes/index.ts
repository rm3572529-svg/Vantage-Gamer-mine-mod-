import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statsRouter from "./stats";
import modsRouter from "./mods";
import developersRouter from "./developers";
import announcementsRouter from "./announcements";
import adminRouter from "./admin";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(modsRouter);
router.use(developersRouter);
router.use(announcementsRouter);
router.use(adminRouter);
router.use(settingsRouter);

export default router;
