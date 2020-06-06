const core = require('@actions/core');
const fs = require('fs');
const github = require('@actions/github');
const glob = require('glob');
const mime = require('mime-types')
const path = require('path');

process.on('unhandledRejection', (err) => {
  core.error(err);
  core.setFailed(err.message);
});

async function uploadMultiple(fileList, context, octokit, url) {
  for (let file of fileList) {
    upload(file, context, octokit, url);
  }
}

async function upload(filePath, context, octokit, url) {
  filePath = filePath.trim();
  let file = fs.readFileSync(filePath);
  let fileName = path.basename(filePath);
  let mimeType = mime.lookup(fileName) || 'application/octet-stream';

  console.log(`Uploading file: ${filePath}`);

  try {
    await octokit.repos.uploadReleaseAsset({
      name: fileName,
      file: file,
      url: url,
      headers: {
        "content-length": file.length,
        "content-type": mimeType
      }
    });
    console.log(`Uploaded ${fileName}`);
  } catch (error) {
    core.setFailed(`Upload failed: ${error.message} ${JSON.stringify(error.errors)}`);
  }
}

async function run() {
  const octokit = new github.GitHub(process.env.GITHUB_TOKEN);
  const context = github.context;

  // Get the target URL
  let url = core.getInput('upload_url', { required: true });

  console.log(`Uploading release assets`)

  var list = [];

  list = list.concat(glob.sync(core.getInput('asset_files', { required: true })));

  // Clean up list by removing any non-truthy values
  list = list.filter(n => n);

  // Upload the lot of 'em
  uploadMultiple(list, context, octokit, url);
}

run();
