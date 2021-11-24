import { ethers } from "ethers";
import Koa from "koa";
import Router from "koa-router";
import koaBody from "koa-body";
import logger from "koa-logger";
import { SmartHome } from "./smart-home";
import { readFile } from "fs";
import { promisify } from "util";

const app = new Koa();
const router = new Router();
const readFileAsync = promisify(readFile);

app.use(logger());

const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner();

router.get("/:address/thermostatTemperature", async ctx => {
    const contract = new SmartHome(ctx.params.address, provider);

    ctx.body = await contract.thermostatTemperature();
});

router.put("/:address/thermostatTemperature", koaBody(), async ctx => {
    const temperature = Number(ctx.request.body?.data);

    if (Number.isNaN(temperature) || temperature < 0) {
        throw ctx.throw(400, "Missing or bad temperature");
    }

    const contract = new SmartHome(ctx.params.address, provider);

    const daiWithSigner = contract.connect(signer);

    ctx.body = await daiWithSigner.setThermostatTemperature(temperature);
});

router.get("/:address/garageCamera", async ctx => {
    const contract = new SmartHome(ctx.params.address, provider);

    ctx.body = await contract.garageCamera();
});

router.put("/:address/garageCamera", koaBody({ multipart: true }), async ctx => {
    const image = ctx.request.files?.data;

    if (!image || Array.isArray(image)) {
        throw ctx.throw(400, "Missing or bad image");
    }

    const contract = new SmartHome(ctx.params.address, provider);

    const daiWithSigner = contract.connect(signer) as SmartHome;

    const file = await readFileAsync(image.path);

    ctx.body = await daiWithSigner.setGarageCamera(file);
});

router.get("/:address/bedroomLight", async ctx => {
    const contract = new SmartHome(ctx.params.address, provider);

    ctx.body = await contract.bedroomLight();
});

router.put("/:address/bedroomLight", koaBody(), async ctx => {
    const light = Boolean(ctx.request.body?.data);

    const contract = new SmartHome(ctx.params.address, provider);

    const daiWithSigner = contract.connect(signer) as SmartHome;

    ctx.body = await daiWithSigner.setBedroomLight(light);
});

app.use(router.routes());

app.listen(3000, () => console.log("Listening on port 3000"));