import Script from "next/script";
import source from "../index.html?raw";

const bodyMarkup = source.match(/<body[^>]*>([\s\S]*?)<script\s+src="\.\/script\.js"><\/script>\s*<\/body>/i)?.[1] ?? "";

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyMarkup }} />
      <Script src="/script.js" strategy="afterInteractive" />
    </>
  );
}
