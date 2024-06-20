import * as data from './demo-dir/inspection.json';
import * as domains from './data/webxray/domain_owners.json';
// const acceptedSubstrings = ['heapanalytics', 'optimizely']; // Example substrings to match

// match the rightmost substring- either exact match on the domain, or a substring that starts with a dot
    // = 
// try updating to more recent vers of node

function regExpEscape (s) {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

function wildcardToRegExp (s) {
    return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$');
}

function getUses(domain) {
    const indices = Object.keys(domains);
    for (let i = 0; i < indices.length; i++) {
        if (domains[i]?.domains.includes(domain)) {
            console.log("uses" + domains[i]?.uses);
        }
      }
}

(async () => {

    // update the accepted set based on the csp
    fetch('https://www.aclu.org/')
    .then(response => {
        let accepted = new Set(['optimizely.com']);
        const headers = response.headers
        const csp = headers.get('Content-Security-Policy')?.split(' ');
       if (csp) {
        csp.forEach((c) => {
            accepted.add(c);
        })
       }
       return accepted;
    })
    .then( accepted => {
        console.log(accepted);
        const third_parties = data.hosts.requests.third_party;
        let count = 0;
        // console.log(third_parties);
        third_parties.forEach(p => {
            let approved = false;
            console.log(p);
            getUses(p);
    
            // check if there's an exact match
            if (accepted.has(p)) {
                approved = true;
            } 
             // check if there's a regex match
            else {
                accepted.forEach((e) => {
                    const e1 = wildcardToRegExp(e);
                    const e2 = e as string;
                    if (e1.test(p)){
                        approved = true;
                    }
                    if (p.endsWith(e2)){
                        approved = true;
                    }
                });
            }

            // find what type of resource this is

            // alternative: 
            if (approved) {
                console.log('approved');
            } else {
                count++;
                console.log('not approved');
            }
            console.log();
        });
        console.log(count + ' unapproved third parties')
    }
    );
})();
