import express, { Request, Response } from "express";
import expressJSDocSwagger from "express-jsdoc-swagger";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

const options = {
  info: {
    version: "1.0.0",
    title: "Rinse Orders Map Api Documentation",
    license: {
      name: "MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "The local endpoint path",
    },
  ],
  security: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
    },
    BasicAuth: {
      type: "http",
      scheme: "basic",
    },
  },
  filesPattern: ["**/*.ts", "../src/**/*.ts"], // Glob pattern to find your jsdoc files (it supports arrays too ['./**/*.ts'])
  baseDir: __dirname,
  swaggerUIPath: "/doc", // SwaggerUI will be render in this url. Default: '/api-docs'
  exposeSwaggerUI: true, // Expose OpenAPI UI. Default true
  exposeApiDocs: false, // Expose Open API JSON Docs documentation in `apiDocsPath` path. Default false.
  apiDocsPath: "/doc", // Open API JSON Docs endpoint. Default value '/v3/api-docs'.
};

(async () => {
  try {
    await app.prepare();
    const server = express();

    // Define variable
    const listener = expressJSDocSwagger(server)(options as any);
    listener.on("finish", (swaggerObject) => {
      console.log(__dirname);
      console.log(JSON.stringify(swaggerObject, null, 2), "open api"); // This will print JSON OpenAPI result
    });

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
