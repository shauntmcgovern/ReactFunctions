const https = require("https");

const repositoryName =
  "shauntmcgovern/GATTEYENTERPRiSESXATTEYECOMPLEXXENTERPRiSESSHAUNiNTELLECTUALSPROPERTYSHEROiNSiGNiASHASBANGSGAMEiNCC";
const githubApi = "https://api.github.com";
const maxResponseBytes = 5 * 1024 * 1024;

function requestHttps(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      { headers: { "User-Agent": "ReactFunctions", ...headers } },
      (response) => {
        let body = "";
        let responseBytes = 0;
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          responseBytes += Buffer.byteLength(chunk);
          if (responseBytes > maxResponseBytes) {
            request.destroy(new Error("A GitHub API response exceeded the 5 MB limit."));
            return;
          }
          body += chunk;
        });
        response.on("end", () => {
          resolve({ statusCode: response.statusCode || 502, body });
        });
      }
    );

    request.setTimeout(15000, () => {
      request.destroy(new Error("GitHub API request timed out."));
    });
    request.on("error", reject);
  });
}

async function requestJson(url) {
  const response = await requestHttps(url, {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });
  let result;
  try {
    result = JSON.parse(response.body);
  } catch {
    throw new Error("GitHub returned an invalid repository response.");
  }
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(result.message || `GitHub repository request failed (${response.statusCode}).`);
  }
  return result;
}

async function fetchRepositoryExample(filePath) {
  const repository = await requestJson(`${githubApi}/repos/${repositoryName}`);
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  const file = await requestJson(
    `${githubApi}/repos/${repositoryName}/contents/${encodedPath}?ref=${encodeURIComponent(repository.default_branch)}`
  );
  if (file.type !== "file" || typeof file.path !== "string" || typeof file.html_url !== "string") {
    throw new Error("GitHub did not return the requested repository file.");
  }

  let source;
  if (file.encoding === "base64" && typeof file.content === "string") {
    source = Buffer.from(file.content, "base64").toString("utf8");
  } else if (file.encoding === "none" && typeof file.download_url === "string") {
    const response = await requestHttps(file.download_url);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(`GitHub file download failed (${response.statusCode}).`);
    }
    source = response.body;
  } else {
    throw new Error("GitHub did not return the requested file as text.");
  }

  const previewLength = 1200;
  return {
    file: {
      path: file.path,
      html_url: file.html_url,
      size: file.size,
      lineCount: source.split(/\r?\n/).length,
      preview: source.slice(0, previewLength),
      previewTruncated: source.length > previewLength,
    },
  };
}

module.exports = function setupProxy(app) {
  app.get("/api/github/emoji-heaven-example", async (req, res) => {
    try {
      res.json(await fetchRepositoryExample("TONEFacce/EmojiHeaven.js"));
    } catch (error) {
      res.status(502).json({ message: error.message });
    }
  });

  app.get("/api/github/nineteen-namespace-example", async (req, res) => {
    try {
      res.json(
        await fetchRepositoryExample(
          "TONEFacce/{M{X}}{CG'CG'CG'CG'CG'CG'CG}ccurrent'''NameSpace[][][][19{9'99}--19'99]partN{i}neteenNameSpaceNineteen.txt"
        )
      );
    } catch (error) {
      res.status(502).json({ message: error.message });
    }
  });
};
