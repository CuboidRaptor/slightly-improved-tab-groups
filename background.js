function handleTabCreated(tab) {
    // goofy heuristic to determine new tabs
    if ((tab.title === "New Tab") && (tab.status === "complete")) {
        browser.tabs.query({groupId: tab.groupId}).then((tabs) => {
            // find leftmost tab by searching for lowest index
            let firstTab = tabs.reduce((acc, cur) => ((cur.index < acc.index) ? cur : acc));

            console.log(firstTab);
        })
    }
}

browser.tabs.onCreated.addListener(handleTabCreated);

//function handleTabUpdated(changeInfo, tabInfo) {
//    //console.log(changeInfo);
//    console.log(tabInfo);
//}
//
//browser.tabs.onUpdated.addListener(handleTabUpdated, {properties: ["url"]});
