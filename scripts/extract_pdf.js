const fs = require("fs");
const pdf = require("pdf-parse");

async function main() {
    const filePath = "./public/HV_Alexis_Rojas_Mayo2026.pdf";
    if (!fs.existsSync(filePath)) {
        console.error("File not found:", filePath);
        process.exit(1);
    }
    const dataBuffer = fs.readFileSync(filePath);
    try {
        // Some versions/environments might need require("pdf-parse").default or similar
        const parse = typeof pdf === "function" ? pdf : pdf.default;
        if (typeof parse !== "function") {
            throw new Error("pdf-parse is not a function. Export keys: " + Object.keys(pdf).join(", "));
        }
        const data = await parse(dataBuffer);
        process.stdout.write(data.text);
    } catch (err) {
        console.error("ERROR_EXTRACTING_PDF", err);
        process.exit(1);
    }
}
main();
