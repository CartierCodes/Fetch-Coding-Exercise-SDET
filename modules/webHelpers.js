import { ALERT_SUCCESS_TEXT } from "../constants.js"


// Browser Action Functions
export async function fillBowls(leftBowlSlots, rightBowlSlots, leftBars, rightBars) {
    await Promise.all(leftBars.map((e, i) => { leftBowlSlots[i].setValue(e) }));
    await Promise.all(rightBars.map((e, i) => { rightBowlSlots[i].setValue(e) }));
}

export async function clickWeighButton(browser, weighButton, resultButton) {
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

export async function getAllWeighings(browser) {
    return (await browser.$$('.game-info > ol > li')).map((x) => x.getText());
}

export async function clickResetButton(resetButton) {
    await resetButton.click();
}

export async function clickFakeBar(browser, barNum) {
    await browser.$(`#coin_${barNum}`).click();
}

export async function getAlertText(browser) {
    return await browser.getAlertText(); 
}

export async function foundCorrectBar(browser, barNum) {
    await clickFakeBar(browser, barNum);
    return await getAlertText(browser) === ALERT_SUCCESS_TEXT;
}