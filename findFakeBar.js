const { remote } = require('webdriverio');

const RUN_BROWSER_HEADLESS = false; // Change to 'true' for headless execution
const ALERT_SUCCESS_TEXT = "Yay! You find it!";

(async () => {
    const chromeArgs = RUN_BROWSER_HEADLESS ? ['headless', 'disable-gpu'] : [];

    const browser = await remote({
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': { args: chromeArgs }        
        }
    });

    await browser.url('http://sdetchallenge.fetch.com/');

    const numberOfBars = (await browser.$$('.coins > button')).length; // Scales with more or less bars

    // Browser Elements
    const weighButton = await browser.$('#weigh');
    const resultButton = await browser.$('#reset');
    const resetButton = await browser.$$('#reset')[1];

    const leftBowlSlots = []
    const rightBowlSlots = []
    for (let i = 0; i < numberOfBars; i++) {
        leftBowlSlots.push(await browser.$(`#left_${i}`));
        rightBowlSlots.push(await browser.$(`#right_${i}`));
    }
    

    // Browser Action Functions
    async function fillBowls(leftBars, rightBars) {
        await leftBars.forEach((e, i) => { leftBowlSlots[i].setValue(e) });
        await rightBars.forEach((e, i) => { rightBowlSlots[i].setValue(e) });
    }
    async function clickWeighButton() {
        const weighingsCount = (await browser.$$('.game-info > ol > li')).length;

        await weighButton.click();

        await browser.waitUntil(async function () { // Wait until "Weighings" is updated before continuing
            return ((await browser.$$('.game-info > ol > li')).length) === weighingsCount + 1
        }, {
            timeout: 5000,
            timeoutMsg: 'Expected weightings update sooner than 5s'
        });

        return await resultButton.getText(); // Return the result of the weighing
    }
    async function getAllWeighings() {
        return (await browser.$$('.game-info > ol > li')).map((x) => x.getText());
    }
    async function clickResetButton() {
        await resetButton.click();
    }
    async function clickFakeBar(barNum) {
        await browser.$(`#coin_${barNum}`).click();
    }
    async function getAlertText() {
        return await browser.getAlertText(); 
    }
    async function foundCorrectBar(barNum) {
        await clickFakeBar(barNum);
        return (await getAlertText() == ALERT_SUCCESS_TEXT) ? true : false;
    }


    // Modified Ternary Search Algorithm
    async function findFakeBar(bars) {
        if (bars.length == 1) { return bars[0]; }
        split_left = Math.ceil(bars.length / 3);
        split_right = split_left * 2;

        bars_1 = bars.slice(0, split_left);
        bars_2 = bars.slice(split_left, split_right);
        bars_3 = (bars.length > split_right) ? bars.slice(split_right) : null;

        await fillBowls(bars_1, bars_2);
        const res = await clickWeighButton();
        await clickResetButton();

        if (res === ">") {
            return await findFakeBar(bars_2);
        } else if (res === "<") {
            return await findFakeBar(bars_1);
        } else {
            return await findFakeBar(bars_3);
        }
    }

    // Run the Algorithm
    let barsArray = [...Array(numberOfBars).keys()];
    const fakeBar = await findFakeBar(barsArray);

    // Variables to Output
    const success = await foundCorrectBar(await fakeBar);
    const alertText = await getAlertText();
    const weighingsList = await getAllWeighings();
    const numberOfWeighings = weighingsList.length;
    

    // Close browser if headless, leave it open if not
    if (RUN_BROWSER_HEADLESS) { await browser.deleteSession(); }


    // Output Results
    console.log("\n\n=============== RESULTS ===============\n")
    console.log("Success:", success);
    console.log("Alert Message:", alertText);
    console.log("Number of Weighings:", numberOfWeighings);
    console.log("List of Weighings:");
    weighingsList.forEach((weighing, i) => console.log(`${i+1})`, weighing));
    console.log("\n=======================================\n\n")

})();
