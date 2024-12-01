const colors = {
    reset: '\x1b[0m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    yellow: '\x1b[33m'
};

 
export const log = {
    print: function(color,...message) {
       
        const now = new Date();
        const timestamp = now.toLocaleString();

       
        const formattedMessage = `${colors[color]}[${timestamp}] ${colors.reset}`;

        console.log(`${formattedMessage}`,...message);
    },

    
    blue: function(...message) {
        this.print('blue',...message);
    },

    red: function(...message) {
        this.print('red',...message);
    },

    yellow: function(...message) {
        this.print('yellow',...message);
    }
};

