const https = require("https");

module.exports = function setupProxy(app) {
  app.get("/api/github/xi-search", (req, res) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      res.status(503).json({
        message: "GitHub search is not configured. Set GITHUB_TOKEN in .env.local and restart the app.",
      });
      return;
    }

    const githubUrl = new URL("https://api.github.com/search/code");
    githubUrl.searchParams.set("q", '"Xi Jinping" user:shauntmcgovern is:public');
    githubUrl.searchParams.set("per_page", "5");

    const request = https.get(
      githubUrl,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "ReactFunctions",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
      (githubResponse) => {
        let responseBody = "";
        githubResponse.setEncoding("utf8");
        githubResponse.on("data", (chunk) => {
          responseBody += chunk;
        });
        githubResponse.on("end", () => {
          let result;
          try {
            result = JSON.parse(responseBody);
          } catch {
            res.status(502).json({ message: "GitHub returned an invalid search response." });
            return;
          }

          if (githubResponse.statusCode < 200 || githubResponse.statusCode >= 300) {
            res.status(githubResponse.statusCode).json({
              message: result.message || `GitHub code search failed (${githubResponse.statusCode}).`,
            });
            return;
          }
          if (!Array.isArray(result.items)) {
            res.status(502).json({ message: "GitHub search response did not include results." });
            return;
          }

          res.json({
            items: result.items
              .filter((item) => item.repository?.private === false)
              .map((item) => ({
                html_url: item.html_url,
                path: item.path,
                repository: { full_name: item.repository.full_name },
              })),
          });
        });
      }
    );

    request.setTimeout(15000, () => {
      request.destroy(new Error("GitHub code search timed out."));
    });
    request.on("error", (error) => {
      if (!res.headersSent) {
        res.status(502).json({ message: error.message });
      } else {
        res.destroy(error);
      }
    });
  });
};
