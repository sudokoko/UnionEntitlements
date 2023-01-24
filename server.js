import express from 'express'
import fetch from 'node-fetch'
const handler = express()
const port = process.env.PORT

function EntitlementsLog(msg) {
    console.log(`<CoreEntitlements> [Main:Info] ` + msg)
}

var entitlements = {
    "LBP_UNION_SILVERHEART": "10000005002211385900_EN00021595_ER99567843"
}

handler.get('/entitlement/:user/:id/:token', async (req, res) => {
    var entitlementUser = req.params["user"];
    var entitlementId = req.params["id"];
    var entitlementToken = req.params["token"];

    EntitlementsLog(`Entitlement ID: ${entitlementId}`);
    EntitlementsLog(`Entitlement Token: ${entitlementToken}`);

    if (entitlements.hasOwnProperty(entitlementId)) {
        if (Object.keys(entitlements).includes(entitlementId) && Object.values(entitlements).includes(entitlementToken)) {
            EntitlementsLog(`Granted entitlement ${entitlementId} to ${entitlementUser}.`);
            const response = await fetch('https://discord.com/api/users/' + entitlementUser, {
                headers: {
                    'Authorization': 'Bot ' + (process.env.BOT_TOKEN)
                }
            })
            
            outputJson = await response.json()
            console.log(outputJson)
            res.status(200).send("Entitlement granted. You can now close this window.")
        }
        else {
            res.status(403).send("Entitlement grant failed. No authorization.");
        }
    }
    else {
        res.status(403).send("Entitlement grant failed. No authorization.");
    };
});

handler.get('*', (req, res) => {
    res.status(403).send("Entitlement grant failed. Improper request.");
});

handler.listen(port, () => {
    EntitlementsLog(`Server listening on port ${port}`)
});
