#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Script to check for unique logins across developer categories
 * Analyzes oneTimeDevsLogins, partTimeDevsLogins, and fullTimeDevsLogins
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

// Check for duplicates within a single array
function findInternalDuplicates(array, categoryName) {
  const seen = new Set();
  const duplicates = new Set();

  array.forEach((login) => {
    if (seen.has(login)) {
      duplicates.add(login);
    } else {
      seen.add(login);
    }
  });

  return {
    categoryName,
    duplicates: Array.from(duplicates),
    count: duplicates.size,
  };
}

// Check for duplicates across different arrays
function findCrossCategoryDuplicates(categories) {
  const allLogins = new Map(); // login -> [categories it appears in]
  const crossDuplicates = new Map();

  // Track which categories each login appears in
  Object.entries(categories).forEach(([categoryName, logins]) => {
    logins.forEach((login) => {
      if (!allLogins.has(login)) {
        allLogins.set(login, []);
      }
      allLogins.get(login).push(categoryName);
    });
  });

  // Find logins that appear in multiple categories
  allLogins.forEach((categoriesArray, login) => {
    if (categoriesArray.length > 1) {
      crossDuplicates.set(login, categoriesArray);
    }
  });

  return crossDuplicates;
}

// Generate statistics
function generateStats(categories) {
  const stats = {};
  let totalLogins = 0;

  Object.entries(categories).forEach(([categoryName, logins]) => {
    const uniqueLogins = new Set(logins);
    stats[categoryName] = {
      total: logins.length,
      unique: uniqueLogins.size,
      duplicatesWithinCategory: logins.length - uniqueLogins.size,
    };
    totalLogins += logins.length;
  });

  // Calculate total unique across all categories
  const allUniqueLogins = new Set();
  Object.values(categories).forEach((logins) => {
    logins.forEach((login) => allUniqueLogins.add(login));
  });

  stats.overall = {
    totalEntries: totalLogins,
    totalUniqueLogins: allUniqueLogins.size,
    duplicatesAcrossCategories: totalLogins - allUniqueLogins.size,
  };

  return stats;
}

// Create a cleaned version of the data
function createCleanedData(data, crossDuplicates) {
  const cleaned = JSON.parse(JSON.stringify(data)); // Deep copy

  if (crossDuplicates.size > 0) {
    console.log("\n📋 CLEANUP SUGGESTIONS:");
    console.log(
      "The following logins appear in multiple categories and should be reviewed:\n"
    );

    crossDuplicates.forEach((categories, login) => {
      console.log(`  • ${login} appears in: ${categories.join(", ")}`);
    });

    console.log(
      "\nRecommendation: Review these duplicates and decide which category each developer should belong to."
    );
  }

  return cleaned;
}

// Main function
function main() {
  console.log("🔍 CHECKING LOGIN UNIQUENESS\n");
  console.log("=".repeat(50));

  const data = readDataFile();
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

  // Check for internal duplicates in each category
  console.log("\n📊 INTERNAL DUPLICATES (within each category):");
  let hasInternalDuplicates = false;

  Object.entries(categories).forEach(([categoryName, logins]) => {
    const result = findInternalDuplicates(logins, categoryName);
    if (result.count > 0) {
      hasInternalDuplicates = true;
      console.log(`\n  ❌ ${categoryName}:`);
      console.log(`     Found ${result.count} duplicate login(s):`);
      result.duplicates.forEach((duplicate) => {
        const count = logins.filter((login) => login === duplicate).length;
        console.log(`     - "${duplicate}" appears ${count} times`);
      });
    } else {
      console.log(`\n  ✅ ${categoryName}: No internal duplicates`);
    }
  });

  if (!hasInternalDuplicates) {
    console.log("\n  🎉 All categories have unique logins internally!");
  }

  // Check for cross-category duplicates
  console.log("\n\n🔀 CROSS-CATEGORY DUPLICATES:");
  const crossDuplicates = findCrossCategoryDuplicates(categories);

  if (crossDuplicates.size > 0) {
    console.log(
      `\n  ❌ Found ${crossDuplicates.size} login(s) appearing in multiple categories:\n`
    );

    crossDuplicates.forEach((categoriesArray, login) => {
      console.log(
        `     • "${login}" appears in: ${categoriesArray.join(", ")}`
      );
    });
  } else {
    console.log("\n  ✅ No logins appear in multiple categories!");
  }

  // Generate and display statistics
  console.log("\n\n📈 STATISTICS:");
  const stats = generateStats(categories);

  Object.entries(stats).forEach(([key, value]) => {
    if (key === "overall") {
      console.log(`\n  📊 Overall:`);
      console.log(`     Total entries: ${value.totalEntries}`);
      console.log(`     Unique logins: ${value.totalUniqueLogins}`);
      console.log(
        `     Duplicate entries: ${value.duplicatesAcrossCategories}`
      );
    } else {
      console.log(`\n  📋 ${key}:`);
      console.log(`     Total: ${value.total}`);
      console.log(`     Unique: ${value.unique}`);
      if (value.duplicatesWithinCategory > 0) {
        console.log(
          `     Internal duplicates: ${value.duplicatesWithinCategory}`
        );
      }
    }
  });

  // Create cleaned data suggestions
  createCleanedData(data, crossDuplicates);

  console.log("\n" + "=".repeat(50));

  // Exit with appropriate code
  const hasIssues = hasInternalDuplicates || crossDuplicates.size > 0;
  if (hasIssues) {
    console.log("❌ Issues found! Please review the duplicates above.");
    process.exit(1);
  } else {
    console.log("✅ All logins are unique! No issues found.");
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  findInternalDuplicates,
  findCrossCategoryDuplicates,
  generateStats,
};
