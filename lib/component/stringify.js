var R          = require('ramda');
var fromObject = require('./from-object');

module.exports = R.curry(function stringify (opts, tree) {
    var displayName = opts.displayName;

    let props;
    if( tree.props) {
        props='{';
        for(const [ key, value ] of Object.entries(tree.props)) {
            if (value === undefined) continue;
            props+=key+'='+JSON.stringify(value)+', ';
        }

        props +='...rest }';
    } else {
        props='props';
    }


    var preamble = [
        'var React = require(\'react\');',
        '',
        'function ' + displayName + ' ('+props+') {',
    ];

    var postamble = [
        '}',
        // Deprecated
        // '',
        // displayName + '.defaultProps = ' + JSON.stringify(tree.props || {}) + ';',
        '',
        'module.exports = ' + displayName + ';',
        '',
        displayName + '.default = ' + displayName + ';',
        ''
    ];

    return preamble.
        concat([fromObject(tree, true)]).
        concat(postamble).
        join('\n');
});
