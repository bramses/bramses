// Include node fs (file stream) and https modules
const fs = require('fs');
const https = require('https');

// API endpoint
const url = 'https://dev.to/api/articles?username=<YOUR DEV USERNAME>';

function readWriteAsync() {
  // Get articles using HTTPS
  https.get(url, (res) => {
    res.setEncoding('utf8');

    // Set variable body to response data from API
    let body = '';
    res.on('data', (data) => body += data);

    res.on('end', () => {
      // Parse the JSON response
      body = JSON.parse(body);

      // Shorten array to latest 3 articles
      body = body.slice(0, 3);

      // Create string of markdown to be inserted
      const articles = `\n - [${body[0].title}](${body[0].url})\n - [${body[1].title}](${body[1].url})\n - [${body[2].title}](${body[2].url})\n \n`;

      // Update README using FS
      fs.readFile('README.md', 'utf-8', (err, data) => {
        if (err) {
          throw err;
        }

        // Replace text using regex: "I'm writing: ...replace... ![Build"
        // Regex101.com is a lifesaver!
        const updatedMd = data.replace(
          /(?<=I'm writing:\n)[\s\S]*(?=\!\[Build)/gim,
          articles
        );

        // Write the new README
        fs.writeFile('README.md', updatedMd, 'utf-8', (err) => {
          if (err) { 
            throw err;
          }

          console.log('README update complete.');
        });
      });
    });
  });
}

// Call the function
readWriteAsync();
