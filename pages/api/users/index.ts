import { seed } from "@/db/seed";
import { createClient } from "@vercel/postgres";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";

type UserDto = {
  name: string;
  email: string;
  image: string;
};

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

    switch (req.method) {
      case "GET":
        //
        let data;
        try {
          data = await client.sql`SELECT * FROM users`;
        } catch (e: any) {
          console.log("error fetching data", e);
          if (e.message === `relation "users" does not exist`) {
            console.log(
              "Table does not exist, creating and seeding it with dummy data now..."
            );
            // Table is not created yet
            await seed(client);
            data = await client.sql`SELECT * FROM users`;
          } else {
            res.status(500).json({ message: "Table error" });
            return;
          }
        }
        res.status(200).json({ message: "Success!", data: data.rows });
        break;

      case "POST":
        //
        const { name, email }: UserDto = req.body;
        let { image } = req.body;
        if (!name || !email) {
          res.status(412).json({
            message: "Error: Fill all the fields",
          });
        }
        if (!image) {
          image = "";
        }
        const id = nanoid(16);
        try {
          const newUser = await client.sql`
            INSERT INTO users (id, name, email, image)
            VALUES (${id}, ${name}, ${email}, ${image})
            ON CONFLICT (email) DO NOTHING;
            `;

          res.status(200).json({
            message: "Success!",
            data: {
              user: newUser.rows,
            },
          });
        } catch (error) {
          console.log("Error creating user", error);
          res.status(500).json({
            message: "Error creating user",
          });
        }
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
