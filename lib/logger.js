var util = require('util'),
    colors = require('colors/safe');

// available levels:
var levels = {
    'debug': {order: 0, color: 'blue'},
    'info': {order: 1, color: 'green'},
    'warn': {order: 2, color: 'yellow'},
    'error': {order: 3, color: 'red'},
    'silent': {order: 1000, color: 'black'}
};

/**
 * Returns a string containing the current time
 * @private
 * 
 * @returns {string}
 */
function __getTimeStr(){
    var d = new Date();
    return util.format('%s:%s:%s.%s', 
        d.getHours(), 
        d.getMinutes(), 
        d.getSeconds(), 
        d.getMilliseconds());
}

/**
 * Offers methods to write to the console.
 * This logger supports component strings and log levels.
 * 
 * @param {string} component The base component where this logger was created.
 * @param {string} level The minimum required level.
 */
function Logger(component, level){
    this.component = component;
    this.level = levels[level];
}

/**
 * Returns a string containing the chained components plus a splitter (: )
 * @private
 * 
 * @param {string} subComp The sub component to chain.
 * @returns {string}
 */
Logger.prototype.__createCompStr = function(subComp){
    var comps = [];
    if(this.component && this.component.length){
        comps.push(this.component);
    }
    if(subComp && subComp.length){
        comps.push(subComp);
    }
    var str = comps.join('.');
    
    return str.length ? str + ':' : '';
};

/**
 * Writes the given message to the console.
 * 
 * @param {string} subComp The sub component wher this message is logged.
 * @param {string} message The message to log.
 * @param {String} level The log level of the message. 
 */
Logger.prototype.log = function log(subComp, message, level) {
    var l = typeof level === 'object' ? level :
        levels[level] || {order: 10, color: 'black'};
    if(l.order >= this.level.order){
        var c = colors[l.color] || colors.black;
        var str = c(util.format('[%s %s] %s %s', 
            __getTimeStr(),
            level.toUpperCase(),
            this.__createCompStr(subComp),
            message));
            
        console.log(str);
    }
};

/**
 * Logs the given message with level 'debug'.
 * 
 * @param {string} subComp The sub component wher this message is logged.
 * @param {string} message The message to log.
 */
Logger.prototype.debug = function(subComp, message){
    this.log(subComp, message, 'debug');
};

/**
 * Logs the given message with level 'info'.
 * 
 * @param {string} subComp The sub component wher this message is logged.
 * @param {string} message The message to log.
 */
Logger.prototype.info = function(subComp, message){
    this.log(subComp, message, 'info');
};

/**
 * Logs the given message with level 'warn'.
 * 
 * @param {string} subComp The sub component wher this message is logged.
 * @param {string} message The message to log.
 */
Logger.prototype.warn = function(subComp, message){
    this.log(subComp, message, 'warn');
};

/**
 * Logs the given message with level 'error'.
 * 
 * @param {string} subComp The sub component wher this message is logged.
 * @param {string} message The message to log.
 */
Logger.prototype.error = function(subComp, message){
    this.log(subComp, message, 'error');
};