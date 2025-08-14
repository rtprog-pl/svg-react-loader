/*globals describe, it*/
require('should');
const read = require("../../../lib/util/read-file");

describe('svg-react-loader/lib/component/stringify', () => {
    const toModule  = require('../../../lib/component/stringify')({
        displayName: 'SvgReactComponent'
    });
    const sanitize = require('../../../lib/sanitize')({
        filters: [
            require('../../../lib/sanitize/filters/text-content')(null),
            require('../../../lib/sanitize/filters/normalize-node')(null),
            require('../../../lib/sanitize/filters/prop-mapper')(null),
            require('../../../lib/sanitize/filters/camel-case-props')(null),
            require('../../../lib/sanitize/filters/remove-xmlns-props')(null)
        ]
    });
    const xmlParser = require('../../../lib/xml/parse')(null);
    const read      = require('../../../lib/util/read-file');

    const expectedProps = {
        version:          "1.1",
        x:                "0px",
        y:                "0px",
        viewBox:          "0 0 16 16",
        enableBackground: "new 0 0 16 16",
        xmlSpace:         "preserve",
        className:        "simple"
    };

    it('should return the correct string for a component function', (done) => {
        read('test/samples/simple.svg').
            flatMap(xmlParser).
            map(sanitize).
            map(toModule).
            subscribe(
                (result) => {
                    result.
                        should.
                        equal(
                            'var React = require(\'react\');\n\n' +
                            'function SvgReactComponent ({"version":"1.1","x":"0px","y":"0px","viewBox":"0 0 16 16","enableBackground":"new 0 0 16 16","xmlSpace":"preserve","className":"simple", ...rest }) {\n' +
                            '    return React.createElement("svg", {version, x, y, viewBox, enableBackground, xmlSpace, className, ...rest },' +
                            '[React.createElement("rect",{"x":"0","y":"0",' +
                            '"width":"16","height":"16","fill":"#fff","key":0}),' +
                            'React.createElement("text",{"key":1},"Foobar")' +
                            ']);\n' +
                            '}\n\n' +
                            'module.exports = SvgReactComponent;\n\n' +
                            'SvgReactComponent.default = SvgReactComponent;\n'
                        );
                },
                (error) => { throw error; },
                done
            );
    });

    it('should return the correct string for a component function for SVG without default props', (done) => {
        read('test/samples/text.svg').
        flatMap(xmlParser).
        map(sanitize).
        map(toModule).
        subscribe(
            (result) => {
                result.
                should.
                equal(
                    'var React = require(\'react\');\n\n' +
                    'function SvgReactComponent (props) {\n' +
                    '    return React.createElement("svg", props,' +
                    'React.createElement("g",null,[React.createElement("title",{"key":0},"The Title"),React.createElement("text",{"x":"20","y":"20","key":1},"Text")]));\n' +
                    '}\n\n' +
                    'module.exports = SvgReactComponent;\n\n' +
                    'SvgReactComponent.default = SvgReactComponent;\n'
                );
            },
            (error) => { throw error; },
            done
        );
    });
});
