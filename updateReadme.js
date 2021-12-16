// Include node fs (file stream) and https modules
const fs = require('fs');
const https = require('https');
const NotionAPI = require('notion-client')

const main = async () => {
  // you can optionally pass an authToken to access private notion resources
  const api = new NotionAPI.NotionAPI()

  // fetch a page's content, including all async blocks, collection queries, and signed urls
  const page = await api.getPage('a49c1e962b7646879176ac3b327b6533')
  // console.log(JSON.stringify(page['block'], null, 2))

  const blocks = page['block']
  const keys = Object.keys(blocks)
  const imageURLs = []
  keys.forEach(key => {
    const block = blocks[key]
    if (block['value']['type'] === 'image') {
      const image = block['value']['format']['display_source']
      const url = new URL(
        `https://www.notion.so${image.startsWith("/image") ? image : `/image/${encodeURIComponent(image)}`
        }`
      );

      const table = block.value.parent_table === "space" ? "block" : block.value.parent_table;
      url.searchParams.set("table", table);
      url.searchParams.set("id", block.value.id);
      url.searchParams.set("cache", "v2");


      imageURLs.push(url.toString())
    }
  })

  const randomImage = `1![](${imageURLs[Math.floor(Math.random() * imageURLs.length)]})2`

  console.log(randomImage)
  
  fs.readFile('README.md', 'utf-8', (err, data) => {
    if (err) {
      throw err;
    }

    // Replace text using regex: "I'm writing: ...replace... ![Build"
    // Regex101.com is a lifesaver!
    const preUpdate = data.replace(
      /1\s*\S*2/gim,
      'memeres'
      )
    
    const updatedMd = data.replace(
      /memeres/gim,
      randomImage
    );

    // Write the new README
    fs.writeFile('README.md', updatedMd, 'utf-8', (err) => {
      if (err) { 
        throw err;
      }

      console.log('README update complete.');
    });
  });
  
  return randomImage

}

// Call the function
main();
