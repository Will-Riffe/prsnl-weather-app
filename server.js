const express = require('express');
const app = express();
const port = 3001; 

app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
