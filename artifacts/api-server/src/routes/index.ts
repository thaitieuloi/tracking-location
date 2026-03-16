import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import familiesRouter from "./families";
import locationsRouter from "./locations";
import geofencesRouter from "./geofences";
import messagesRouter from "./messages";
import sosRouter from "./sos";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(familiesRouter);
router.use(locationsRouter);
router.use(geofencesRouter);
router.use(messagesRouter);
router.use(sosRouter);

export default router;
