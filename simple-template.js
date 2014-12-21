function sTmp(tpl, data) {
	var reg = /<%([^%>]+)?%>/g,
		code = 'var r = [];',
		cursor = 0;

	function addToCode(piece, isJs) {
		var _piece = '',
			regOut = /(^( )?(var|if|for|else|switch|case|break|{|}))(.*)?/g;

		if (isJs) {
			if (regOut.test(piece)) {
				_piece = piece;
			} else {
				_piece = 'r.push('+ piece +');';
			}
		} else {
			_piece = 'r.push("' + piece + '");';
		}

		if (piece === '') {
			return;
		}

		code += _piece;
	}

	while(m = reg.exec(tpl)) {
		addToCode(tpl.slice(cursor, m.index));
		addToCode(m[1], true);
		cursor = m.index + m[0].length;
	}

	addToCode(tpl.substr(cursor, tpl.length - cursor));

	code += 'return r.join("");';

	return new Function(code).apply(data);

}

var a = sTmp("<%if (this.a) {%><div><%this.num%></div><%}%>", {a: true, num: 5});
console.log(a);