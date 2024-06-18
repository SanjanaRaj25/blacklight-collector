import * as data from './demo-dir/inspection.json';
const accepted = ['heapanalytics.com', 'optimizely.com'];

(async () => {
    const third_parties = data.hosts.requests.third_party;
    let count = 0;
    // console.log(third_parties);
    third_parties.forEach((p) => {
        console.log(p)
        let approved = false;
        accepted.forEach((s) => {
            if (p.includes(s)) {
                approved = true;
                console.log('approved by the ACLU')
            }
        })
        if (!approved) {
            count += 1
            console.log('not approved by the ACLU')
        }
        console.log();
    })
    console.log(count + ' unapproved third parties')
})();
