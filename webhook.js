const http = require('http');
const { spawn } = require('child_process');

const port = 5000; // Adjust the port number as needed

const handleRequest = (request, response) => {
  if (request.method === 'POST') {
    let data = '';
    request.on('data', (chunk) => {
      data += chunk;
    });

    request.on('end', () => {
      const payload = JSON.parse(data);
      const branch = payload.ref.replace('refs/heads/', '');

      if (branch === 'main') {
        const gitPull = spawn('git', ['pull']);
        gitPull.stdout.on('data', (data) => {
          console.log(`git pull output: ${data}`);
        });

        gitPull.stderr.on('data', (data) => {
          console.error(`git pull error: ${data}`);
        });

        gitPull.on('close', (code) => {
          if (code === 0) {
            const pm2Restart = spawn('pm2', ['restart', 'skool']);
            pm2Restart.stdout.on('data', (data) => {
              console.log(`pm2 restart output: ${data}`);
            });

            pm2Restart.stderr.on('data', (data) => {
              console.error(`pm2 restart error: ${data}`);
            });

            pm2Restart.on('close', (code) => {
              if (code === 0) {
                console.log('Successfully pulled and restarted PM2 app.');
                response.statusCode = 200;
                response.end();
              } else {
                console.error('Failed to restart PM2 app.');
                response.statusCode = 500;
                response.end();
              }
            });
          } else {
            console.error('Failed to pull changes from Git repository.');
            response.statusCode = 500;
            response.end();
          }
        });
      } else {
        console.log(`Ignoring webhook event for branch '${branch}'.`);
        response.statusCode = 200;
        response.end();
      }
    });
  } else {
    console.log('Ignoring non-POST webhook request.');
    response.statusCode = 200;
    response.end();
  }
};

const server = http.createServer(handleRequest);
server.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
