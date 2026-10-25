const dns = require("dns").promises;

async function testDNS() {
  try {
    const records = await dns.resolveSrv(
      "_mongodb._tcp.interview-ai.yct9c4o.mongodb.net"
    );

    console.log("DNS works:", records);
  } catch (err) {
    console.error("DNS failed:", err);
  }
}

testDNS();