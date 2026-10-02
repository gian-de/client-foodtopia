import { defineEventHandler } from "h3";

export default defineEventHandler((event) => proxyToBackend(event));
