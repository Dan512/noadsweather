// Wipe all tally data for one site. Not deployed (.gcloudignore).
//
// Usage:
//   node tally/wipe.js --site noadsweather.com          (dry run — counts only)
//   node tally/wipe.js --site noadsweather.com --yes    (actually deletes)
//
// Deletes sites/{site} and everything under it (days, pages). Irreversible.
// The counter starts refilling immediately from live traffic, so wipe AFTER
// any beacon changes have propagated, not before.

const { Firestore } = require('@google-cloud/firestore');

const PROJECT_ID = 'pollen-api-492014';

const args = process.argv.slice(2);
const i = args.indexOf('--site');
const SITE = i !== -1 ? args[i + 1] : null;
const YES = args.includes('--yes');

if (!SITE) {
    console.error('A site is required: node tally/wipe.js --site noadsweather.com [--yes]');
    process.exit(1);
}

async function main() {
    const db = new Firestore({ projectId: PROJECT_ID });

    const [days, pages] = await Promise.all([
        db.collection(`sites/${SITE}/days`).count().get(),
        db.collection(`sites/${SITE}/pages`).count().get(),
    ]);
    const nDays = days.data().count, nPages = pages.data().count;
    console.log(`${SITE}: ${nDays} day docs, ${nPages} page docs`);

    if (nDays + nPages === 0) { console.log('Nothing to delete.'); return; }
    if (!YES) {
        console.log('Dry run — add --yes to delete all of the above.');
        return;
    }

    await db.recursiveDelete(db.doc(`sites/${SITE}`));
    console.log(`Deleted. ${SITE} starts from zero with the next beacon.`);
}

main().catch(err => {
    if (/could not load the default credentials|unauthenticated/i.test(String(err))) {
        console.error('Auth needed. Run once:  gcloud auth application-default login');
    }
    console.error(err.message || err);
    process.exit(1);
});
