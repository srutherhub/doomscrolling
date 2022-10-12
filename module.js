import googleTrends from "google-trends-api";
import Fastify from "fastify";
import fs, { appendFile } from "fs";
import { send } from "process";

const fastify = Fastify();

function getDate() {
  let dList = [];
  for (let i = 0; i < 29; i++) {
    let d = new Date();
    d.setDate(d.getDate() - i - 1);
    dList.push(d);
  }
  return dList;
}

async function sendData(country,num) {
    await fastify.get(`/api/${num}`, function (request, reply) {
      let data = (reply.body = []);
      googleTrends
        .dailyTrends({
          trendDate: new Date(getDate()[num]),
          geo: country,
        })
        .then((result) => {
          JSON.parse(
            result
          ).default.trendingSearchesDays[0].trendingSearches.forEach((info) => {
            data.push(info.title.query);
          });
          reply.header("Content-Type", "application/json").send(data);
        }).then;
    });
}
fastify.get("/index", function (request, reply) {
  fs.readFile("index.html", function (err, data) {
    reply.header("Content-Type", "text/html").send(data);
  });
});

for (let i = 0; i < 29; i++) {sendData('US',i)}




fastify.listen({ port: 8080 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
