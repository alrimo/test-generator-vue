export default function() {
    /*  - Unique ID generator
    *   - not UUID or GUID compliant
    *   - won't guarantee collision avoidance
    *   
    *   returns: 4 digit ID 
    *   source: 
    *       https://learnersbucket.com/examples/javascript/unique-id-generator-in-javascript/
    */
    return Math.floor((1 + Math.random()) * 0x10000 )
        .toString(16)
        .substring(1);
}