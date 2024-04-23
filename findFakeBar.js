import { remote } from 'webdriverio'
import { getBrowserElements } from "./modules/webElements.js"
import {
    RUN_BROWSER_HEADLESS,
    CLOSE_BROWSER_ON_FINISH,
    FETCH_SDET_URL
} from "./constants.js"
import {
    fillBowls,
    clickWeighButton,
    getAllWeighings,
    clickResetButton,
    getAlertText,
    foundCorrectBar
} from './modules/webHelpers.js';


(async () => {
    const chromeArgs = RUN_BROWSER_HEADLESS ? ['headless', 'disable-gpu'] : [];

    const browser = await remote({
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': { args: chromeArgs }        
        }
    });

    await browser.url(FETCH_SDET_URL);

    const numberOfBars = (await browser.$$('.coins > button')).length; // Scales with more or less bars

    const {
        weighButton,
        resultButton,
        resetButton,
        leftBowlSlots,
        rightBowlSlots
    } = await getBrowserElements(browser, numberOfBars);


    // Modified Ternary Search Algorithm
    async function findFakeBar(bars) {
        if (bars.length == 1) { return bars[0]; }
        const split_left = Math.ceil(bars.length / 3);
        const split_right = split_left * 2;

        const bars_1 = bars.slice(0, split_left);
        const bars_2 = bars.slice(split_left, split_right);
        const bars_3 = (bars.length > split_right) ? bars.slice(split_right) : null;

        await fillBowls(leftBowlSlots, rightBowlSlots, bars_1, bars_2);
        const res = await clickWeighButton(browser, weighButton, resultButton);
        await clickResetButton(resetButton);

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
    const success = await foundCorrectBar(browser, fakeBar);
    const alertText = await getAlertText(browser);
    const weighingsList = await getAllWeighings(browser);
    const numberOfWeighings = weighingsList.length;
    

    // Close browser if headless, leave it open if not
    if (RUN_BROWSER_HEADLESS || CLOSE_BROWSER_ON_FINISH) { await browser.deleteSession(); }


    // Output Results
    console.log("\n\n=============== RESULTS ===============\n")
    console.log("Fake Bar #:", fakeBar)
    console.log("Success:", success);
    console.log("Alert Message:", alertText);
    console.log("Number of Weighings:", numberOfWeighings);
    console.log("List of Weighings:");
    weighingsList.forEach((weighing, i) => console.log(`${i+1})`, weighing));
    console.log("\n=======================================\n\n")

    // Exit process
    process.exit();

})();
