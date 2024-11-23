const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "..", ".env");
const commitHashKey = "NEXT_PUBLIC_COMMIT_HASH";

try {
  const commitHash = execSync("git rev-parse HEAD").toString().trim();

  let envVars = {};

  if (fs.existsSync(outputPath)) {
    const envContent = fs.readFileSync(outputPath, "utf8");
    envVars = envContent
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"))
      .reduce((acc, line) => {
        const [key, ...value] = line.split("=");
        acc[key.trim()] = value.join("=").trim();
        return acc;
      }, {});
  }

  envVars[commitHashKey] = commitHash;

  const newEnvContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  fs.writeFileSync(outputPath, newEnvContent, "utf8");

  console.log(`Commit hash (${commitHash}) written to .env file`);
} catch (error) {
  console.error("Error generating commit hash:", error.message);
  process.exit(1);
}
