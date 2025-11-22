import { pool } from "../database/connection.js";
import { customAlphabet } from "nanoid";
import { isUrl } from "check-valid-url";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

const generateCode = () => {
  let code = nanoid(8);
  return code;
};

async function generateUniqueCode() {
  let code;

  while (true) {
    code = generateCode();

    const result = await pool.query("SELECT 1 FROM links WHERE code = $1", [code]);

    if (result.rowCount === 0) break;
  }

  return code;
}

// << ------ [MIDDLEWARE] ------ >>

const createUrl = async (req, res, next) => {
  let { url, code } = req.body;
  try {
    if (!isUrl(url)) return res.status(400).json({ message: "Invalid URL" });

    if (code) {
      const exists = await pool.query("SELECT 1 FROM links WHERE code = $1", [code]);
      if (exists.rowCount > 0) return res.status(409).json({ error: "Code already exists" });
    } else code = await generateUniqueCode();

    await pool.query("INSERT INTO links (code, url, total_clicks) VALUES ($1, $2, $3)", [code, url, 1]);

    res.status(201).json({ url, code });
  } catch (error) {
    next(error);
  }
};

const listLinks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT code, url, total_clicks, last_clicked, created_at FROM links ORDER BY created_at DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query("SELECT * FROM links WHERE code = $1", [code]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteLink = async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query("DELETE FROM links WHERE code = $1", [code]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};

const redirect = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query("SELECT url FROM links WHERE code = $1", [code]);

    if (result.rowCount === 0) return res.status(404).send("Not found");

    const link = result.rows[0];

    await pool.query("UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code = $1", [code]);

    let url = "";

    // used regex to achieve normalize url cz, url might be non (scheme-relative) url
    if (!/^https?:\/\//i.test(url)) url = "https://" + link.url;
    else url = link.url;

    res.redirect(302, url);
  } catch (error) {
    next(error);
  }
};

const healthz = async (req, res) => {
  res.json({ ok: true, version: "1.0" });
};

export { createUrl, listLinks, getStats, deleteLink, redirect, healthz };
