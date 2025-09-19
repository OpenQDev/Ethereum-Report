#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Script to extract all unique logins into a single array
 * Combines oneTimeDevsLogins, partTimeDevsLogins, and fullTimeDevsLogins
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
    console.log(`Adding ${logins.length} logins from ${categoryName}`);
    logins.forEach((login) => allLoginsSet.add(login));
  });

  // Convert Set back to array and sort alphabetically
  const allLoginsArray = Array.from(allLoginsSet).sort();

  console.log(`\nTotal unique logins: ${allLoginsArray.length}`);

  return {
    allLogins: allLoginsArray,
    categories: categories,
    stats: {
      oneTimeCount: categories.oneTimeDevsLogins.length,
      partTimeCount: categories.partTimeDevsLogins.length,
      fullTimeCount: categories.fullTimeDevsLogins.length,
      totalEntries:
        categories.oneTimeDevsLogins.length +
        categories.partTimeDevsLogins.length +
        categories.fullTimeDevsLogins.length,
      uniqueCount: allLoginsArray.length,
    },
  };
}

// Save the array to a file
function saveLoginsArray(logins, outputFormat = "json") {
  const outputDir = path.join(__dirname, "output");

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  if (outputFormat === "json") {
    const jsonOutput = {
      allUniqueLogins: logins.allLogins,
      metadata: {
        totalCount: logins.allLogins.length,
        extractedAt: new Date().toISOString(),
        categories: logins.stats,
      },
    };

    const jsonPath = path.join(outputDir, "all-unique-logins.json");
    fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2));
    console.log(`\n✅ JSON array saved to: ${jsonPath}`);
  }

  if (outputFormat === "js" || outputFormat === "both") {
    const jsContent = `// All unique developer logins extracted on ${new Date().toISOString()}
// Total: ${logins.allLogins.length} unique logins

const allUniqueLogins = ${JSON.stringify(logins.allLogins, null, 2)};

module.exports = {
  allUniqueLogins,
  metadata: {
    totalCount: ${logins.allLogins.length},
    extractedAt: "${new Date().toISOString()}",
    categories: ${JSON.stringify(logins.stats, null, 4)}
  }
};
`;

    const jsPath = path.join(outputDir, "all-unique-logins.js");
    fs.writeFileSync(jsPath, jsContent);
    console.log(`✅ JavaScript module saved to: ${jsPath}`);
  }

  if (outputFormat === "txt" || outputFormat === "both") {
    const txtContent = logins.allLogins.join("\n");
    const txtPath = path.join(outputDir, "all-unique-logins.txt");
    fs.writeFileSync(txtPath, txtContent);
    console.log(`✅ Text file saved to: ${txtPath}`);
  }
}

// Display the array in console
function displayArray(logins, showAll = false) {
  console.log("\n" + "=".repeat(60));
  console.log("📋 ALL UNIQUE LOGINS ARRAY");
  console.log("=".repeat(60));

  console.log(`\n📊 Statistics:`);
  console.log(`   One-time developers: ${logins.stats.oneTimeCount}`);
  console.log(`   Part-time developers: ${logins.stats.partTimeCount}`);
  console.log(`   Full-time developers: ${logins.stats.fullTimeCount}`);
  console.log(`   Total entries: ${logins.stats.totalEntries}`);
  console.log(`   Unique logins: ${logins.stats.uniqueCount}`);

  if (showAll) {
    console.log(`\n📝 All ${logins.allLogins.length} unique logins:`);
    console.log("[");
    logins.allLogins.forEach((login, index) => {
      const comma = index < logins.allLogins.length - 1 ? "," : "";
      console.log(`  "${login}"${comma}`);
    });
    console.log("]");
  } else {
    console.log(`\n📝 First 10 logins (use --show-all to see all):`);
    console.log("[");
    logins.allLogins.slice(0, 10).forEach((login, index) => {
      console.log(`  "${login}",`);
    });
    if (logins.allLogins.length > 10) {
      console.log(`  ... and ${logins.allLogins.length - 10} more`);
    }
    console.log("]");
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const showAll = args.includes("--show-all") || args.includes("-a");
  const outputFormat =
    args.find((arg) => arg.startsWith("--format="))?.split("=")[1] || "json";
  const saveToFile = args.includes("--save") || args.includes("-s");

  console.log("🔍 EXTRACTING ALL UNIQUE LOGINS");
  console.log("=".repeat(50));

  const data = readDataFile();
  const logins = extractAllLogins(data);

  displayArray(logins, showAll);

  if (saveToFile) {
    console.log("\n" + "=".repeat(60));
    console.log("💾 SAVING TO FILES");
    console.log("=".repeat(60));
    saveLoginsArray(logins, outputFormat);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ EXTRACTION COMPLETE");

  if (!saveToFile) {
    console.log("\n💡 Tip: Use --save to save the array to files");
    console.log("   Use --show-all to display all logins in console");
    console.log("   Use --format=json|js|txt|both to specify output format");
  }

  console.log("=".repeat(60));
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  extractAllLogins,
  saveLoginsArray,
  displayArray,
};
