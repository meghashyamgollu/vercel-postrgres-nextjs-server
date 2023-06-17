import { QueryResult, QueryResultRow, createClient } from "@vercel/postgres";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";

const connectionString = process.env.NEXT_PUBLIC_POSTGRES_URL_NON_POOLING;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = createClient({
    connectionString: connectionString,
  });

  try {
    console.log("[CONNECTING ... ]");
    await client.connect();
    console.log("[CLIENT CONNECTED]");

    let userId: string | undefined;
    let user: QueryResult<QueryResultRow> | undefined;

    switch (req.method) {
      case "GET":
        //
        console.log("[id]", req.query);
        userId = req.query.id?.toString();
        user = await client.sql`SELECT * FROM users WHERE id = ${userId}`;
        res
          .status(200)
          .json({ message: "Response from param server", data: user.rows });
        break;

      case "PUT":
        //
        userId = req.query.id?.toString();
        const { image } = req.body;
        if (!userId || !image) {
          res.status(412).json({
            message: "Invalid request",
          });
          break;
        }
        user = await client.sql`SELECT * FROM users WHERE id = ${userId}`;
        if (user.rowCount === 0) {
          res.status(405).json({
            message: "User ID doesn't exist",
          });
          break;
        }
        const userUpdate = await client.sql`
            UPDATE users
            SET image = ${image}
            WHERE id = ${userId}
            `;
        res.status(200).json({
          message: "Success!",
          data: userUpdate.rows,
        });
        break;

      default:
        //
        res.status(405).json({
          error: "Method not supported yet",
        });
        break;
    }
  } catch (error) {
    console.log("[CLIENT CONNECTION ERROR]");
    res.status(500).json({ message: "Error connecting to database" });
  } finally {
    await client.end();
    console.log("[CLIENT END]");
  }
}
