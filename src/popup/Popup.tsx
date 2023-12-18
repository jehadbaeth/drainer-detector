import React from 'react';
import CheckResult from 'components/CheckResult';
import browser, { Tabs } from 'webextension-polyfill';
import jsSHA from "jssha";


// Scripts to execute in current tab
const readScript = 'Array.from(document.scripts).map(script => script.src);';

const vulnerableSHA: String[] =
    ['13bcbda5ab4799c9700037e100c027d30a9e6e44',]
async function calculateAndCompareSHA1(fileUrl: string, expectedSHA1: String[]): Promise<boolean> {
    // Fetch the file
    const response = await fetch(fileUrl);
    const fileContent = await response.text();

    // Calculate the SHA-1 of the file content
    const shaObj = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" });
    shaObj.update(fileContent);
    const calculatedSHA1 = shaObj.getHash("HEX");
    console.log(fileUrl + ' SHA-1 Value: ' + calculatedSHA1)
    // Compare the calculated SHA-1 with the expected SHA-1
    return expectedSHA1.includes(calculatedSHA1);
}

/**
 * Executes a string of Javascript on the current tab
 * @param code - The string of code to execute on the current tab
 */
async function fetchAndCheck(code: string): Promise<boolean> {
    // Query for the active tab in the current window
    try {
        const tabs: Tabs.Tab[] = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });

        const currentTab: Tabs.Tab | undefined = tabs[0];

        if (!currentTab) {
            return false;
        }

        const scriptsUsed = await browser.tabs.executeScript(currentTab.id, {
            code,
        }) as string[][];

        for (let i = 0; i < scriptsUsed[0].length; i++) {
            if (scriptsUsed[0][i] === '' && !scriptsUsed[0][i].endsWith('.js')) continue;
            const isVulnerable = await calculateAndCompareSHA1(scriptsUsed[0][i], vulnerableSHA);
            if (isVulnerable) {
                return true;
            }
        }
    } catch (error) {
        console.log(error);
    }

    return false;
}

const Popup = () => {

    const [isVulnerable, setIsVulnerable] = React.useState(false);

    // Sends the `popupMounted` event
    React.useEffect(() => {
        browser.runtime.sendMessage({ popupMounted: true });
    }, []);
    // Handle fetchAndCheck
    React.useEffect(() => {
        const checkScripts = async () => {
            const result = await fetchAndCheck(readScript);
            setIsVulnerable(result);
        };
        checkScripts();
    }, []);

    // Renders the component tree
    return (
        <div className="popupContainer">
            <div className="mx-10 my-10">
                <hr />
                <CheckResult resultText={isVulnerable ? 'Vulnerable dApp' : 'Safe to USE'}></CheckResult>

            </div>
        </div>
    );
};

export default Popup;
