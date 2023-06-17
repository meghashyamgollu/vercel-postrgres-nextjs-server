import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const data = [
  {
    id: "1",
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
    body: null,
  },
  {
    id: "2",
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/:id`,
    body: null,
  },
  {
    id: "3",
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
    body: {
      name: "Rasputin",
      email: "rasputin@test.dev",
      image: "https://placehold.co/600x400",
    },
  },
  {
    id: "4",
    method: "PUT",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/:id`,
    body: { image: "https://placehold.co/600x400" },
  },
];

export default function Home() {
  const [activeId, setActiveId] = useState<string>("");

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start gap-10 p-24 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Server built with NextJS a
          <a href="https://vercel.com/docs/storage/vercel-postgres">
            nd Vercel Postgres DB
          </a>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="w-full max-w-5xl items-start justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-2xl">APIs:</h1>
        <div className="[&>*]:mt-8">
          {data.map((api) => {
            return (
              <div key={api.id}>
                <div className="flex flex-row justify-between items-center rounded-md gap-3">
                  <div className="flex flex-row items-center gap-3">
                    <span className="method-label">{api.method}</span>
                    <code>{api.url}</code>
                  </div>
                  <button
                    onClick={() => {
                      setActiveId(api.id);
                      navigator.clipboard.writeText(api.url);
                      setTimeout(() => {
                        setActiveId("");
                      }, 1000);
                    }}
                    className="hover:text-slate-400 mr-3"
                  >
                    {activeId === api.id ? "copied" : "copy"}
                  </button>
                </div>
                {api.body && <pre>Body: {JSON.stringify(api.body)}</pre>}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
