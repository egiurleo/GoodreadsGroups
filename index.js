const express = require('express');
const goodreads = require('goodreads-api-node');
const https = require("https");
const app = express();

const myCredentials = {
  key: // key here,
  secret: // secret here
};

const gr = goodreads(myCredentials);

app.get('/groups/:groupId/current-books', (req, res) => {
  function done() {
    res.send(shelves);
  }

  gr.getGroupInfo(req.params.groupId)
    .then(info => {
      const userIds = info.group.members.group_user.map(user => {
        return user.user.id._;
      });

      count = 0;
      shelves = [];
      userIds.forEach(id => {
        const url = `https://www.goodreads.com/review/list?v=2&key=0mOY77KwI2KFlpKOHcOA&id=${id}&shelf=currently-reading`;
        https.get(url, res => {
          res.setEncoding("utf8");
          let body = "";
          res.on("data", data => {
            body += data;
          });
          res.on("end", () => {
            shelves.push(body);
            count++;

            if(count == userIds.length) {
              done();
            }
          });
        });
      });
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
