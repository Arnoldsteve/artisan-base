const { PrismaClient } = require('./generated/management');
const prisma = new PrismaClient();

async function main() {
  console.log(Object.keys(prisma)); // See what models are available
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});