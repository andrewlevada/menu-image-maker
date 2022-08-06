import { database } from "firebase-admin";
import Database = database.Database;
import Reference = database.Reference;

type Ref = "mim-bot-cookies";
let dbInstance!: Database;

export function initDatabase() {
  dbInstance = database();
}

export function db(ref: Ref): Reference {
  return dbInstance.ref(ref);
}

// TODO: Should be nullable here
export function getUserCookies(userId: string): Promise<string> {
  return db("mim-bot-cookies").child(userId).once("value").then(snap => snap.val() || null);
}

export function setUserCookies(userId: string, cookies: string): Promise<void> {
  return db("mim-bot-cookies").child(userId).set(cookies);
}
