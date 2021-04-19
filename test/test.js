const {Builder, By} = require('selenium-webdriver');
const assert = require('assert');
const path = require('path');
const remote = require('selenium-webdriver/remote');


const uploaFile = async () => {
  let resultHeader = null;
  let resultFileName = null;

  const driver = new Builder().forBrowser('chrome').build();
  driver.setFileDetector(new remote.FileDetector);

  try {
    // const src = path.join(__dirname, "./assets/img.png");
    const src = path.join(__dirname, "../assets/img.png");
    const ex = /\\/g;
    const str = src.replace(ex, '/');

    await driver.get('http://the-internet.herokuapp.com/upload');
    
    const el = await driver.findElement(By.id('file-upload'));

    await el.sendKeys(str);

    const btn = await driver.findElement(By.id('file-submit'));
    await btn.click();

    const resultElem = await driver.findElement(By.className('example'));
    resultHeader = await resultElem.findElement(By.css('h3')).getText();
    resultFileName = await resultElem.findElement(By.id('uploaded-files')).getText();

  } catch (err) {
    console.log(err);
  } finally {

    await driver.quit();
    if (resultHeader === 'File Uploaded!' && resultFileName === 'img.png') {
      return true;
    } else {
      return false;
    }

  }
};

const getPage = async () => {
  const driver = new Builder().forBrowser('chrome').build();
  await driver.get('http://the-internet.herokuapp.com/dynamic_content');
  let elems = await driver.findElements(By.css('img'));

  const srcArr = [];

  for (elem of elems) {
    const src = await elem.getAttribute("src");
    srcArr.push(src);
  }

  await driver.quit();

  console.log(srcArr);

  let result = false;

  for (let i = 0; i < srcArr.length; i++) {
    for (let j = 0; j < srcArr.length; j++) {
      if (i === j) continue; 
      if (srcArr[i] === srcArr[j]) result = true;
    }
  }
  
  return result;
};

describe('Task', function() {
  this.timeout(300000);

  it('same imgs', async function() {
    const result = await getPage();

    assert.strictEqual(result, true);
  });

  it('upload file', async function() {
    const result = await uploaFile();
    
    assert.strictEqual(result, true);
  });
});