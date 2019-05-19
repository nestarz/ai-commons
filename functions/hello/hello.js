const puppeteer = require("puppeteer");

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // When the method is POST, the name will no longer be in the event’s
  // queryStringParameters – it’ll be in the event body encoded as a query string
  const params = JSON.parse(event.body.replace(/[\x00-\x1F\x7F-\x9F]/g, ""));
  const html = params.html;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(`
  <div class="pdf-header">
    TEST
    <div>Generated License - ${new Date().toJSON().slice(0,10).replace(/-/g,'/')}</div>
  </div>
    ${html.replace(
  /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
  ""
)}
`);
  page.addStyleTag({
    content: `
  * {
    font-size: 14pt;
    font-family: Helvetica, Arial, sans-serif;
  }

  .summary {
    font-size: 14pt;
  }

  .pdf-header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .pdf-header img {
    width: 80%;
    text-align: center;
    margin: 2rem;
  }



  .markdown-body h3 {
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }

  .markdown-body h1,
  .markdown-body h2 {
      clear: both;
      page-break-before: always;
  }

  svg {
      width: 2em !important;
      margin-right: 1rem !important;
  }

  .header {
          display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
  }
  .header svg {
    width: 1.2em !important;
  }
  .summary {
    justify-self: flex-start;
    align-self: stretch;
    margin-top: auto;
    padding: 2rem 0;
    background: rgba(255, 255, 255, 0.1);
  }
  .summary > .title {
    padding-left: 2rem;
    margin-bottom: 1rem;
    font-weight: 700;
    font-size: 120%;
  }
  .summary .field {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    padding: 0.25rem 2rem;
  }
  .summary .field:first-child {
    border: none;
  }
  .summary .field .title {
    flex: 1;
    display: flex;
    padding: 0.1rem 0rem;
    align-items: center;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
  .summary .field .title .icon:not(:empty) {
    flex: 0 0 1.2em;
    height: 1.2rem;
    margin-right: 0.75rem;
  }
  .summary .field .value {
    border-left: 1px solid var(--border-color);
    margin: 0;
    padding: 0;
    margin-left: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .summary {
    margin-top: 6rem;
    background: white;
    border-radius: 2px;
    color: black;
    border: 1px solid black;
  }
  .summary .title {
    margin-bottom: 0;
  }
  .summary .disclamer, .summary .preambule {
    padding: 1rem 2rem;
    padding-top: 0;
  }
  .summary .field {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  .summary .form {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }
  `
  });

  const buffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      left: "1cm",
      top: "1cm",
      right: "1cm",
      bottom: "1cm"
    }
  });
  await browser.close();

  const pdfBase64 = buffer.toString("base64");

  return {
    statusCode: 200,
    body: pdfBase64
  };
};
