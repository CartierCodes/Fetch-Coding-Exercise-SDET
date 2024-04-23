export async function getBrowserElements(browser, numberOfBars) {
    const weighButton = await browser.$('#weigh');
    const resultButton = await browser.$('#reset');
    const resetButton = await browser.$$('#reset')[1];

    const leftBowlSlots = []
    const rightBowlSlots = []
    for (let i = 0; i < numberOfBars; i++) {
        leftBowlSlots.push(await browser.$(`#left_${i}`));
        rightBowlSlots.push(await browser.$(`#right_${i}`));
    }

    return { weighButton, resultButton, resetButton, leftBowlSlots, rightBowlSlots };
}