import cron from "node-cron";
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import { MongoClient } from 'mongodb';
import readline from 'readline';
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { AddShop } from "./Shop.js";
import { CreateDB } from "./createdb.js";
import axios from "axios";
import {PostData} from "./Fetch-apis/PostData.js";
import { log } from "console";

const app = express();
app.use("/api/*", shopify.validateAuthenticatedSession());
app.use(express.json());
 
export function NodeCron() {

    console.log('Backend function executed');

  }



