function handleTabCreated(tab) {
    // goofy heuristic to determine new tabs
    if ((tab.title === "New Tab") && (tab.status === "complete")) {
        browser.tabs.query({groupId: tab.groupId, windowId: tab.windowId}).then((tabs) => {
            // find leftmost tab by searching for lowest index
            let firstTab = tabs.reduce((acc, cur) => ((cur.index < acc.index) ? cur : acc));

            if (tab.cookieStoreId !== firstTab.cookieStoreId) {
                // remove the listener to lock it and prevent an infinite loop
                browser.tabs.onCreated.removeListener(handleTabCreated);
                // this little chunk of code partially taken from mozilla's multi-account-containers addon
                // basically duplicate the current tab with the first tab's container
                browser.tabs.create({
                    // omit the url so it defaults to new tab
                    cookieStoreId: firstTab.cookieStoreId,
                    index: tab.index,
                    active: tab.active,
                    openerTabId: tab.openerTabId,
                    windowId: tab.windowId
                }).then((newTab) => {
                    // put the listener back
                    browser.tabs.onCreated.addListener(handleTabCreated);
                    // remove the old tab that has the incorrect container
                    browser.tabs.remove(tab.id);
                    // and then set its group correctly
                    if (tab.groupId !== -1) {
                        browser.tabs.group({groupId: tab.groupId, tabIds: newTab.id});
                    }
                });
            }
        })
    }
}

browser.tabs.onCreated.addListener(handleTabCreated);
