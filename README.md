# Release Asset Action

A GitHub action to add files to a release.

### Enviroments

`GITHUB_TOKEN`: The GitHub token used to create an authenticated client

### Parameters

| Parameter | Description | Required |
| --------- | ----------- | -------- |
| `asset_files` | Glob pattern of files to upload | Required |
| `upload_url` | The target url for the release file uploads | Required |

### There are two ways you can use this action:

- Trigger on a release (does not work with drafts)
- Chain it after another action that creates an release

If this release is triggered on a "release" event, the url can automatically be
detected. However, if it is chained the `release-url` will need to be passed in
from the previous steps.

### Examples

 ```toml
 name: Build and relase

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: Create Release
      id: create_release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        body: Auto generated release
        draft: true
        prerelease: false
    - name: Build
      run: make
    - name: Upload Assets to Release with a wildcard
      uses: iovxw/upload-release-asset@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        assert_files: "build/*.zip"
        upload_url: ${{ steps.create_release.outputs.upload_url }}
 ```

# License

MIT. See [LICENSE](LICENSE) for details.
