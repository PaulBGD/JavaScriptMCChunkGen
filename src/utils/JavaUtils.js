module.exports = {
    hashCode: function (variable) {
        variable = String(variable);
        var h = 0;
        for (var i = 0; i < variable.length; i++) {
            h = 31 * h + variable.charCodeAt(i);
        }
        return h;
    }
};