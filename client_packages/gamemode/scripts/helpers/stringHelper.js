const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

exports = {
	escapeHtml: (str) => {
		return String(str).replace(/[&<>"'`=\/]/g, function (s) {
			return entityMap[s];
		});
	}
}
