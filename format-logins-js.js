#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Script to format all unique logins as a JavaScript array with single quotes
 * Output format: ['0div', '0g-peterzhb', ...]
 */

// Read the data file
function readDataFile() {
  try {
    const dataPath = path.join(__dirname, "public", "data.json");
    const rawData = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading data file:", error.message);
    process.exit(1);
  }
}

// Extract all unique logins
function extractAllLogins(data) {
  const monthlyActiveDevs = data.monthlyActiveDevs;

  if (!monthlyActiveDevs) {
    console.error("Error: monthlyActiveDevs not found in data file");
    process.exit(1);
  }

  const categories = {
    oneTimeDevsLogins: monthlyActiveDevs.oneTimeDevsLogins || [],
    partTimeDevsLogins: monthlyActiveDevs.partTimeDevsLogins || [],
    fullTimeDevsLogins: monthlyActiveDevs.fullTimeDevsLogins || [],
  };

  // Combine all logins into a single Set to ensure uniqueness
  const allLoginsSet = new Set();

  Object.entries(categories).forEach(([categoryName, logins]) => {
    logins.forEach((login) => allLoginsSet.add(login));
  });

  // Convert Set back to array and sort alphabetically
  const allLoginsArray = Array.from(allLoginsSet).sort();

  return allLoginsArray;
}

// Format as JavaScript array with single quotes
function formatAsJSArray(logins, itemsPerLine = 5) {
  let result = "[\n";

  for (let i = 0; i < logins.length; i++) {
    const login = logins[i];
    const isLast = i === logins.length - 1;
    const comma = isLast ? "" : ",";

    // Add the login with single quotes
    result += `  '${login}'${comma}`;

    // Add newline every itemsPerLine items or if it's the last item
    if ((i + 1) % itemsPerLine === 0 || isLast) {
      result += "\n";
    } else {
      result += " ";
    }
  }

  result += "]";
  return result;
}

// Save formatted array to file
function saveFormattedArray(formattedArray, logins) {
  const outputDir = path.join(__dirname, "output");

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Save as JavaScript file
  const jsContent = `// All unique developer logins formatted as JavaScript array
// Generated on ${new Date().toISOString()}
// Total: ${logins.length} unique logins

const uniqueLogins = ${formattedArray};

module.exports = uniqueLogins;
`;

  const jsPath = path.join(outputDir, "unique-logins-formatted.js");
  fs.writeFileSync(jsPath, jsContent);
  console.log(`✅ Formatted JavaScript array saved to: ${jsPath}`);

  // Save as plain array (just the array part)
  const arrayPath = path.join(outputDir, "unique-logins-array.txt");
  fs.writeFileSync(arrayPath, formattedArray);
  console.log(`✅ Plain array saved to: ${arrayPath}`);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const itemsPerLine =
    parseInt(
      args.find((arg) => arg.startsWith("--per-line="))?.split("=")[1]
    ) || 5;
  const saveToFile = args.includes("--save") || args.includes("-s");
  const showOutput = args.includes("--show") || !saveToFile;

  console.log("🔍 FORMATTING LOGINS AS JAVASCRIPT ARRAY");
  console.log("=".repeat(50));

  const data = readDataFile();
  const logins = extractAllLogins(data);

  console.log(`\n📊 Found ${logins.length} unique logins`);

  const formattedArray = formatAsJSArray(logins, itemsPerLine);

  if (showOutput) {
    console.log("\n📝 Formatted JavaScript Array:");
    console.log("=".repeat(50));
    console.log(formattedArray);
  }

  if (saveToFile) {
    console.log("\n💾 SAVING TO FILES");
    console.log("=".repeat(50));
    saveFormattedArray(formattedArray, logins);
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ FORMATTING COMPLETE");

  if (!saveToFile) {
    console.log("\n💡 Tip: Use --save to save the formatted array to files");
    console.log("   Use --per-line=N to specify items per line (default: 5)");
  }

  console.log("=".repeat(50));
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  extractAllLogins,
  formatAsJSArray,
  saveFormattedArray,
};
