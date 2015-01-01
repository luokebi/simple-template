;
(function() {
	var frontSymbol = '<%',
		endSymlbol = '%>';

    var sTmp = {};

    sTmp.setSymbol = function(front, end) {
    	frontSymbol = front;
    	endSymlbol = end;
    };

    sTmp.setDefaultSymbol = function() {
    	frontSymbol = '<%';
    	endSymlbol = '%>';
    };

    sTmp.compile = function(tpl, data) {
        var reg = new RegExp(frontSymbol + '([^' + endSymlbol + ']+)?' + endSymlbol, "g"),
            code = 'var r = [];',
            cursor = 0;

        function addToCode(piece, isJs) {
            var _piece = '',
                regOut = /(^( )?(var|if|for|else|switch|case|break|{|}))(.*)?/g;

            if (isJs) {
                if (regOut.test(piece)) {
                    _piece = piece;
                } else {
                    _piece = 'r.push(' + piece + ');';
                }
            } else {
                _piece = 'r.push("' + piece + '");';
            }

            if (piece === '') {
                return;
            }

            code += _piece;
        }

        while (m = reg.exec(tpl)) {
            addToCode(tpl.slice(cursor, m.index));
            addToCode(m[1], true);
            cursor = m.index + m[0].length;
        }

        addToCode(tpl.substr(cursor, tpl.length - cursor));

        code += 'return r.join("");';

        return new Function(code).apply(data);
    };

    window.sTmp = sTmp;
})();

var a = sTmp.compile("<%if (this.a) {%><div><%this.num%></div><%}%>", {a: true, num: 5});
console.log(a);
