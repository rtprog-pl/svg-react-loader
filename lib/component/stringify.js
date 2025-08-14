var R          = require('ramda');
var fromObject = require('./from-object');

module.exports = R.curry(function stringify (opts, tree) {
    var displayName = opts.displayName;

    let props;
    if( tree.props) {
        props=JSON.stringify(tree.props);
        props=props.substring(0, props.length-1)+', ...rest }';
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
