'use strict';

module.exports = {
    H_CONFIG: () => {
        const H_CONFIG = {
            host: 'g84t6zfpijzwx08q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'bvi0o6i4puwihszs',
            password: 't6j3hhjg82p5yi6v',
            database: 'ooesezqo9t1r5sup'
        };
        return H_CONFIG;
    },
    
    LOCAL_CONFIG: () => {
        const LOCAL_CONFIG = {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'COMP2800'
        };
        return LOCAL_CONFIG;
    }
}
