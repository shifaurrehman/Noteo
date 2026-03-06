const fs = require("fs");
const path = require("path");

const targetDir = path.join(process.cwd(), "src");

function printStructure(dir, indent = "") {
  const items = fs.readdirSync(dir);

  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const isLast = index === items.length - 1;
    const prefix = isLast ? "└── " : "├── ";

    console.log(indent + prefix + item);

    if (fs.statSync(fullPath).isDirectory()) {
      const newIndent = indent + (isLast ? "    " : "│   ");
      printStructure(fullPath, newIndent);
    }
  });
}

if (!fs.existsSync(targetDir)) {
  console.log("❌ src folder not found.");
  process.exit(1);
}

console.log("src");
printStructure(targetDir);